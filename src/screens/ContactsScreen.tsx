import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';
import useTheme from '../hooks/useTheme';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import useAuth from '../hooks/useAuth';
import { initCometChat } from '../services/cometChatService';

type Props = NativeStackScreenProps<RootStackParamList, 'Contacts'>;

type CometUser = {
  uid: string;
  name: string;
  avatar?: string;
  status?: string;
};

type ContactSection = {
  title: string;
  data: CometUser[];
};

export default function ContactsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { uid: myUid } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<CometUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Garantir que o CometChat está inicializado
      await initCometChat();
      
      const usersRequest = new CometChat.UsersRequestBuilder()
        .setLimit(100)
        .build();
        
      const fetchedUsers = await usersRequest.fetchNext();
      console.log('[ContactsScreen] Usuários buscados:', fetchedUsers.length);
      
      const mapped: CometUser[] = (fetchedUsers as any[])
        .filter((u: any) => u.uid !== myUid?.toLowerCase())
        .map((u: any) => ({
          uid: u.uid,
          name: u.name || u.uid,
          avatar: u.avatar,
          status: u.status,
        }));
      setUsers(mapped);
    } catch (error: any) {
      console.error('Erro ao buscar contatos CometChat:', error);
      Alert.alert('Erro', 'Não foi possível carregar contatos. Verifique sua conexão.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((u) => u.name.toLowerCase().includes(normalized) || u.uid.includes(normalized));
  }, [search, users]);

  const sections = useMemo<ContactSection[]>(() => {
    const sorted = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
    const grouped = new Map<string, CometUser[]>();

    sorted.forEach((user) => {
      const first = user.name.trim().charAt(0).toUpperCase() || '#';
      const key = /[A-Z]/.test(first) ? first : '#';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(user);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([title, data]) => ({ title, data }));
  }, [filteredUsers]);

  const startChat = (user: CometUser) => {
    navigation.navigate('Chat', {
      conversationId: user.uid,
      userId: user.uid,
      name: user.name,
      avatar: user.avatar || null,
    });
  };

  if (loading) {
    return <LoadingSpinner message="Carregando contatos..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Contatos</Text>
        <TouchableOpacity style={styles.headerAction} onPress={loadUsers}>
          <Ionicons name="refresh" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Buscar Contatos"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.listTitle, { color: colors.primary }]}>
          {users.length} contato{users.length !== 1 ? 's' : ''}
        </Text>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.sectionContent}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.75}
              onPress={() => startChat(item)}
            >
              <Avatar uri={item.avatar || null} name={item.name} size={54} online={item.status === 'online'} />
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.contactStatus, { color: item.status === 'online' ? '#34C759' : colors.textSecondary }]}>
                  {item.status === 'online' ? 'online' : 'offline'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.alert(`Iniciando chat com ${item.name}...`);
                  } else {
                    Alert.alert('Chat', `Iniciar conversa com ${item.name}?`);
                  }
                  startChat(item);
                }}
              >
                <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={56} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {search ? 'Nenhum contato encontrado' : 'Ainda não há contatos.\nOutros usuários registrados aparecerão aqui.'}
              </Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 82, backgroundColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('NewChat')}
      >
        <Ionicons name="person-add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchWrap: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listCard: {
    flex: 1,
    borderRadius: 22,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
