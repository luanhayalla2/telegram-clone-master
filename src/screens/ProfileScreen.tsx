import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { getUserProfile, signOut } from '../services/authService';
import useOnlineStatus from '../hooks/useOnlineStatus';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';
import SettingRow from '../components/SettingRow';
import { UserProfile } from '../types/user';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation, route }: Props) {
  const { uid: currentUserId } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const uid = route.params?.uid || currentUserId;

  const { statusText, online } = useOnlineStatus(uid || '');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'media' | 'files' | 'links'>('media');

  const { language } = useSettings();

  const loadProfile = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserProfile(uid);
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao sair');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando perfil..." />;
  }

  const displayName = profile?.displayName || 'Sem nome';
  const isCurrentUser = uid === currentUserId;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 200 }]}> 
        <View style={styles.profileHeader}>
          <Avatar uri={profile?.photoURL || null} name={displayName} size={90} online={isCurrentUser ? true : online} />
          <Text style={[styles.name, { color: colors.textPrimary }]}>{displayName}</Text>
          <Text style={[styles.status, { color: colors.textSecondary }]}>{isCurrentUser ? 'online' : statusText || 'visto recentemente'}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoBlock}>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{profile?.phone || '+55 (XX) XXXXX-XXXX'}</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Celular</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {profile?.username ? `@${profile.username}` : '@username'}
            </Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nome de Usuario</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {profile?.bio || (isCurrentUser ? 'Nenhuma bio definida' : 'Este usuario nao definiu uma bio.')}
            </Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Bio</Text>
          </View>

          <View style={[styles.infoBlock, { marginBottom: 0 }]}> 
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{profile?.birthday || '--/--/----'}</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Aniversario</Text>
          </View>
        </View>

        {isCurrentUser && (
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>CONFIGURAÇÕES</Text>
            <SettingRow
              iconName="person"
              iconBgColor="#2A85FF"
              label="Conta"
              subtitle="Email, Nome, Foto"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <SettingRow
              iconName="chatbubble"
              iconBgColor="#F7931A"
              label="Configuracoes de Chat"
              onPress={() => navigation.navigate('ChatSettings')}
            />
            <SettingRow
              iconName="lock-closed"
              iconBgColor="#34C759"
              label="Privacidade e Seguranca"
              onPress={() => navigation.navigate('Privacy')}
            />
            <SettingRow
              iconName="notifications"
              iconBgColor="#FF3B30"
              label="Notificacoes"
              onPress={() => navigation.navigate('Notifications')}
            />
            <SettingRow
              iconName="pie-chart"
              iconBgColor="#5856D6"
              label="Dados e Armazenamento"
              onPress={() => navigation.navigate('DataStorage')}
            />
            <SettingRow
              iconName="folder"
              iconBgColor="#007AFF"
              label="Pastas de Chat"
              onPress={() => navigation.navigate('ChatFolders')}
            />
            <SettingRow
              iconName="laptop-outline"
              iconBgColor="#64D2FF"
              label="Dispositivos"
              onPress={() => navigation.navigate('Devices')}
            />
            <SettingRow
              iconName="battery-half"
              iconBgColor="#FF9500"
              label="Economia de Energia"
              onPress={() => navigation.navigate('PowerSaving')}
            />
            <SettingRow
              iconName="globe-outline"
              iconBgColor="#AF52DE"
              label="Idioma"
              subtitle={language === 'pt' ? 'Portugues (Brasil)' : 'English'}
              onPress={() => navigation.navigate('Language')}
            />
             <SettingRow
              iconName="star"
              iconBgColor="#AF52DE"
              label="Telegram Premium"
              onPress={() => navigation.navigate('Premium')}
            />
            <SettingRow
              iconName="wallet"
              iconBgColor="#007AFF"
              label="Carteira"
              onPress={() => navigation.navigate('Wallet')}
            />
            <SettingRow
              iconType="MaterialCommunityIcons"
              iconName="storefront"
              iconBgColor="#FF3B30"
              label="Telegram Business"
              onPress={() => navigation.navigate('Business')}
            />
            <SettingRow
              iconName="help-circle"
              iconBgColor="#FF9500"
              label="Ajuda"
              onPress={() => navigation.navigate('Help')}
            />
            <SettingRow
              iconName="exit-outline"
              iconBgColor="#FF3B30"
              label="Sair da Conta"
              onPress={handleLogout}
              isLast
            />
          </View>
        )}

        <View style={styles.tabsContainer}>
          <View style={[styles.tabsBackground, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'media' && styles.tabActive, activeTab === 'media' && { backgroundColor: isDark ? '#2A2A35' : '#dce9ff' }]}
              onPress={() => setActiveTab('media')}
            >
              <Text style={[activeTab === 'media' ? styles.tabTextActive : styles.tabTextInactive, { color: activeTab === 'media' ? colors.tabBarActive : colors.textSecondary }]}>Mídia</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'files' && styles.tabActive, activeTab === 'files' && { backgroundColor: isDark ? '#2A2A35' : '#dce9ff' }]}
              onPress={() => setActiveTab('files')}
            >
              <Text style={[activeTab === 'files' ? styles.tabTextActive : styles.tabTextInactive, { color: activeTab === 'files' ? colors.tabBarActive : colors.textSecondary }]}>Arquivos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'links' && styles.tabActive, activeTab === 'links' && { backgroundColor: isDark ? '#2A2A35' : '#dce9ff' }]}
              onPress={() => setActiveTab('links')}
            >
              <Text style={[activeTab === 'links' ? styles.tabTextActive : styles.tabTextInactive, { color: activeTab === 'links' ? colors.tabBarActive : colors.textSecondary }]}>Links</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'media' && (
            <View style={styles.mediaGrid}>
              {profile?.media && profile.media.length > 0 ? (
                profile.media.map((uri, index) => (
                  <View key={index} style={styles.mediaThumbnail}>
                    <Avatar uri={uri} name="M" size={100} />
                  </View>
                ))
              ) : (
                <EmptyTabState icon="images-outline" text="Nenhuma mídia compartilhada." color={colors.textSecondary} />
              )}
            </View>
          )}

          {activeTab === 'files' && (
            <View style={styles.filesList}>
              {profile?.sharedFiles && profile.sharedFiles.length > 0 ? (
                profile.sharedFiles.map((fileName, index) => (
                  <View key={index} style={[styles.fileRow, { borderBottomColor: colors.separator }]}>
                    <Ionicons name="document-outline" size={24} color={colors.primary} />
                    <Text style={[styles.fileName, { color: colors.textPrimary }]}>{fileName}</Text>
                  </View>
                ))
              ) : (
                <EmptyTabState icon="folder-open-outline" text="Nenhum arquivo compartilhado." color={colors.textSecondary} />
              )}
            </View>
          )}

          {activeTab === 'links' && (
             <EmptyTabState icon="link-outline" text="Nenhum link compartilhado." color={colors.textSecondary} />
          )}
        </View>
      </ScrollView>

      {isCurrentUser && (
        <View style={[styles.fabContainer, { bottom: insets.bottom + 82 }]}> 
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: colors.primary }]} 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="camera" size={20} color="#FFF" style={styles.fabIcon} />
            <Text style={styles.fabText}>Novo Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  infoCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoBlock: {
    marginBottom: 16,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
  },
  settingsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  tabsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tabsBackground: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: '#2A2A35',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaThumbnail: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  filesList: {
    marginTop: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  fileName: {
    fontSize: 16,
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 24,
  },
  fab: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  fabIcon: {
    marginRight: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

function EmptyTabState({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon as any} size={48} color={color} style={{ marginBottom: 16 }} />
      <Text style={[styles.emptySubtitle, { color }]}>{text}</Text>
    </View>
  );
}

