import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import { spacing } from '../theme/spacing';

const MOCK_STATUS = [
  { id: '1', name: 'Maria Silva', time: 'Há 5 minutos', avatar: 'https://i.pravatar.cc/150?u=maria' },
  { id: '2', name: 'João Souza', time: 'Há 20 minutos', avatar: 'https://i.pravatar.cc/150?u=joao' },
  { id: '3', name: 'Ana Oliveira', time: 'Há 1 hora', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: '4', name: 'Pedro Santos', time: 'Hoje, 14:30', avatar: 'https://i.pravatar.cc/150?u=pedro' },
  { id: '5', name: 'Carla Lima', time: 'Hoje, 10:15', avatar: 'https://i.pravatar.cc/150?u=carla' },
];

export default function StatusScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: typeof MOCK_STATUS[0] }) => (
    <TouchableOpacity style={styles.statusItem} activeOpacity={0.7}>
      <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.statusInfo}>
        <Text style={[styles.statusName, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.statusTime, { color: colors.textSecondary }]}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Meu Status */}
        <TouchableOpacity style={styles.myStatusContainer} activeOpacity={0.7}>
          <View style={styles.myAvatarWrapper}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=me' }} 
              style={[styles.avatar, { opacity: 0.8 }]} 
            />
            <View style={[styles.addIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={16} color="#FFF" />
            </View>
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusName, { color: colors.textPrimary }]}>Meu Status</Text>
            <Text style={[styles.statusTime, { color: colors.textSecondary }]}>Toque para atualizar</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#1a1a1e' : '#f0f2f5' }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ATUALIZAÇÕES RECENTES</Text>
        </View>

        <FlatList
          data={MOCK_STATUS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
        />

        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Seas atualizações de status são protegidas com criptografia de ponta a ponta.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 85 }]}>
         <TouchableOpacity
           style={[styles.fabSmall, { backgroundColor: isDark ? '#2c2c2e' : '#e4e6eb' }]}
           activeOpacity={0.8}
           onPress={() => {
             if (Platform.OS === 'web') {
               window.alert('Escrever status: Funcionalidade de status em texto será adicionada em breve!');
             } else {
               Alert.alert('Escrever Status', 'Adicione um status em texto. Em breve!');
             }
           }}
         >
           <Ionicons name="pencil" size={20} color={colors.textPrimary} />
         </TouchableOpacity>
         <TouchableOpacity
           style={[styles.fabLarge, { backgroundColor: colors.primary }]}
           activeOpacity={0.8}
           onPress={() => {
             if (Platform.OS === 'web') {
               window.alert('Câmera: Postar foto/vídeo no status. Funcionalidade disponível no app mobile!');
             } else {
               Alert.alert('Câmera', 'Gravar vídeo ou foto para o status.');
             }
           }}
         >
           <Ionicons name="camera" size={26} color="#FFF" />
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  myStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'transparent',
  },
  myAvatarWrapper: {
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  statusInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  statusName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusTime: {
    fontSize: 14,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 88,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },
  privacyText: {
    fontSize: 12,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    gap: 16,
  },
  fabSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      },
    }),
  },
  fabLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
      },
    }),
  },
});
