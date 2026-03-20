import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { spacing } from '../theme/spacing';
import ChatListItem from '../components/ChatListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import { chatGetConversations } from '../services/chatApi';
import { getChatSession } from '../services/chatSession';
import { onReceiveMessage } from '../services/chatSocket';
import type { ChatApiConversation, ChatApiUser } from '../types/chatApi';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

export default function ChatListScreen({ navigation }: Props) {
  const { colors: themeColors } = useTheme();
  const { chatFolders } = useSettings();
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<ChatApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState('all_chats');

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getChatSession();
      if (!session?.userId) {
        setMyUserId(null);
        setConversations([]);
        return;
      }

      setMyUserId(session.userId);
      const fetched = await chatGetConversations(session.userId);
      setConversations(fetched || []);
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
      Alert.alert('Erro', error?.message || 'Não foi possível carregar suas conversas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
      return () => {};
    }, [loadConversations])
  );

  useEffect(() => {
    const unsubscribe = onReceiveMessage(() => {
      loadConversations();
    });

    return () => {
      unsubscribe?.();
    };
  }, [loadConversations]);

  const filteredConversations = useMemo(() => {
    let result = conversations;
    
    // Filter by Folder
    if (selectedFolderId !== 'all_chats') {
      const folder = chatFolders.find(f => f.id === selectedFolderId);
      if (folder) {
        result = result.filter(c => {
          // Simplistic type detection based on participant count
          const type = c.participants.length > 2 ? 'groups' : 'private';
          return folder.includedTypes.includes(type);
        });
      }
    }

    // Filter by Search
    const normalized = search.trim().toLowerCase();
    if (normalized) {
      result = result.filter((c) => {
        const other = getOtherParticipant(c, myUserId);
        const name = other?.nome || other?.username || '';
        return name.toLowerCase().includes(normalized);
      });
    }

    return result;
  }, [search, conversations, myUserId, selectedFolderId, chatFolders]);

  const renderConversation = useCallback(
    ({ item }: { item: ChatApiConversation }) => {
      const other = getOtherParticipant(item, myUserId);
      const name = other?.nome || other?.username || 'Conversa';
      const avatar = other?.foto || null;

      const lastMessageText = item.lastMessage?.text ? String(item.lastMessage.text) : '';
      const timestamp = item.lastMessage?.createdAt
        ? Math.floor(new Date(item.lastMessage.createdAt).getTime() / 1000)
        : Math.floor(new Date(item.updatedAt).getTime() / 1000);

      return (
        <ChatListItem
          id={item._id}
          name={name}
          lastMessage={lastMessageText || 'Toque para abrir'}
          timestamp={timestamp}
          unreadCount={0}
          avatar={avatar}
          online={false}
          onPress={() => {
            if (!other?._id) {
              Alert.alert('Erro', 'Participante inválido nesta conversa.');
              return;
            }

            navigation.navigate('Chat', {
              conversationId: item._id,
              userId: other._id,
              name,
              avatar,
            });
          }}
        />
      );
    },
    [navigation, myUserId]
  );

  if (loading) {
    return <LoadingSpinner message="Carregando conversas..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: themeColors.inputBackground }]}>
          <Ionicons name="search" size={18} color={themeColors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.textPrimary }]}
            placeholder="Buscar Chats"
            placeholderTextColor={themeColors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Chat Folders Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {chatFolders.map((folder) => {
            const isActive = selectedFolderId === folder.id;
            return (
              <TouchableOpacity
                key={folder.id}
                onPress={() => setSelectedFolderId(folder.id)}
                style={[
                  styles.tab,
                  isActive && { borderBottomColor: themeColors.primary, borderBottomWidth: 2 }
                ]}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { color: isActive ? themeColors.primary : themeColors.textSecondary },
                    isActive && { fontWeight: 'bold' }
                  ]}
                >
                  {folder.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: themeColors.separator }]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={54}
              color={themeColors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>Nenhuma conversa encontrada</Text>
          </View>
        }
      />

      <View style={[styles.fabStack, { bottom: insets.bottom + 82 }]}>
        <TouchableOpacity
          style={[
            styles.fabSmall,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.separator,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Câmera', 'Abrir câmera em breve.')}
        >
          <Ionicons name="camera-outline" size={22} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabPrimary, { backgroundColor: themeColors.primary }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NewChat')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getOtherParticipant = (conversation: ChatApiConversation, myUserId: string | null): ChatApiUser | null => {
  if (!conversation.participants || conversation.participants.length === 0) return null;
  if (!myUserId) return conversation.participants[0];

  return conversation.participants.find((p) => p._id !== myUserId) || conversation.participants[0];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  tabsContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2D2E33',
  },
  tabsScroll: {
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 15,
  },
  listContent: {
    paddingVertical: spacing.xs,
    paddingBottom: 180,
    flexGrow: 1,
  },
  fabStack: {
    position: 'absolute',
    right: 18,
    alignItems: 'center',
    zIndex: 10,
  },
  fabSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#141518',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2D2E33',
  },
  fabPrimary: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F7CFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 7,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 5px 7px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 80,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
