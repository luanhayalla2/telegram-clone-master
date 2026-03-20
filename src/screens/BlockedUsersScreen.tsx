import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import Avatar from '../components/Avatar';

export default function BlockedUsersScreen() {
  const { colors } = useTheme();
  const { blockedUsers, setBlockedUsers } = useSettings();

  const handleUnblock = (id: string) => {
    setBlockedUsers(blockedUsers.filter(userId => userId !== id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-remove-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum usuário bloqueado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.userRow, { backgroundColor: colors.surface }]}>
            <Avatar name="Usuário" size={40} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>ID: {item}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.unblockButton, { borderColor: colors.primary }]}
              onPress={() => handleUnblock(item)}
            >
              <Text style={[styles.unblockText, { color: colors.primary }]}>DESBLOQUEAR</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginTop: 16 },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    marginHorizontal: 16, 
    marginVertical: 4, 
    borderRadius: 8 
  },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: '500' },
  unblockButton: { 
    borderWidth: 1, 
    borderRadius: 4, 
    paddingVertical: 4, 
    paddingHorizontal: 8 
  },
  unblockText: { fontSize: 12, fontWeight: 'bold' },
});
