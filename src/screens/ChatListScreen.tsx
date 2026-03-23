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
import { CometChat } from '@cometchat/chat-sdk-react-native';
import useAuth from '../hooks/useAuth';
import { initCometChat } from '../services/cometChatService';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

export default function ChatListScreen({ navigation }: Props) {
  const { colors: themeColors } = useTheme();
  const { chatFolders } = useSettings();
  const insets = useSafeAreaInsets();
  const { uid: myUid } = useAuth();

  const [conversations, setConversations] = useState<CometChat.Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('all_chats');

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      await initCometChat();
      const conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(50)
        .build();
      
      const fetched = await conversationsRequest.fetchNext();
      setConversations(fetched);
    } catch (error: any) {
      console.error('Erro ao carregar conversas CometChat:', error);
      // Don't alert on background refresh to avoid annoying the user
      if (loading) {
        Alert.alert('Erro', 'Não foi possível carregar as conversas.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadConversations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
      return () => {};
    }, [loadConversations])
  );

  // Listener para novas mensagens na lista
  useEffect(() => {
    const listenerSettings = new CometChat.MessageListener({
      onTextMessageReceived: (textMessage: any) => {
        loadConversations();
      }
    });
    
    const listenerID = 'CHAT_LIST_LISTENER';
    CometChat.addMessageListener(listenerID, listenerSettings);
    
    return () => {
      CometChat.removeMessageListener(listenerID);
    };
  }, [loadConversations]);

  const filteredConversations = useMemo(() => {
    let result = conversations;
    
    // Filtro por Pasta (Simplificado)
    if (selectedFolderId !== 'all_chats') {
      const folder = chatFolders.find(f => f.id === selectedFolderId);
      if (folder) {
        result = result.filter(c => {
          const type = c.getConversationType() === CometChat.RECEIVER_TYPE.GROUP ? 'groups' : 'private';
          return folder.includedTypes.includes(type);
        });
      }
    }

    // Filtro por Busca
    const normalized = search.trim().toLowerCase();
    if (normalized) {
      result = result.filter((c) => {
        const other: any = c.getConversationWith();
        const name = other.name || other.uid || '';
        return name.toLowerCase().includes(normalized);
      });
    }

    return result;
  }, [search, conversations, selectedFolderId, chatFolders]);

  const renderConversation = ({ item }: { item: CometChat.Conversation }) => {
    const other: any = item.getConversationWith();
    const lastMsg: any = item.getLastMessage();
    const name = other.name || other.uid || 'Conversa';
    const avatar = other.avatar || null;
    const lastMessageText = lastMsg?.text || (lastMsg?.data?.text || 'Toque para abrir');
    const timestamp = lastMsg?.sentAt || 0;
    const unreadCount = item.getUnreadMessageCount() || 0;

    return (
      <ChatListItem
        id={other.uid}
        name={name}
        lastMessage={lastMessageText}
        timestamp={timestamp}
        unreadCount={unreadCount}
        avatar={avatar}
        online={other.status === 'online'}
        onPress={() => {
          navigation.navigate('Chat', {
            conversationId: other.uid,
            userId: other.uid,
            name,
            avatar,
          });
        }}
      />
    );
  };

  if (loading && conversations.length === 0) {
    return <LoadingSpinner message="Carregando chats..." />;
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

      {/* Abas de Pastas */}
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
        keyExtractor={(item) => item.getConversationId()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: themeColors.separator }]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={64}
              color={themeColors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
              {search ? 'Nenhum chat encontrado' : 'Nenhuma conversa ativa.\nInicie um chat nos Contatos!'}
            </Text>
          </View>
        }
        onRefresh={loadConversations}
        refreshing={loading}
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
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Câmera: Abrir câmera para tirar foto. Disponível no app mobile!');
            } else {
              Alert.alert('Câmera', 'Abrindo câmera para capturar foto...');
            }
          }}
        >
          <Ionicons name="camera-outline" size={26} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabPrimary, { backgroundColor: themeColors.primary }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: spacing.md, paddingBottom: spacing.xs },
  searchBar: { flexDirection: 'row', alignItems: 'center', height: 44, borderRadius: 12, paddingHorizontal: spacing.md },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: 16, height: '100%' },
  tabsContainer: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2D2E33' },
  tabsScroll: { paddingHorizontal: spacing.md },
  tab: { paddingVertical: 12, paddingHorizontal: 16, marginRight: 8 },
  tabText: { fontSize: 15 },
  listContent: { paddingVertical: spacing.xs, paddingBottom: 180, flexGrow: 1 },
  fabStack: { position: 'absolute', right: 18, alignItems: 'center', zIndex: 10 },
  fabSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#141518',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2E33',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }
    })
  },
  fabPrimary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 7 },
      android: { elevation: 8 },
      web: { boxShadow: '0px 5px 7px rgba(0,0,0,0.35)' }
    })
  },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 80 },
  emptyContainer: { flex: 1, paddingTop: 100, alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { marginBottom: 20 },
  emptyTitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
