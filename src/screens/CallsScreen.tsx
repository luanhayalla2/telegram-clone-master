import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import useTheme from '../hooks/useTheme';
import Avatar from '../components/Avatar';
import { spacing } from '../theme/spacing';

const MOCK_CALLS = [
  {
    id: '1',
    name: 'Henrique Luan',
    type: 'incoming',
    missed: true,
    time: '14:30',
    date: 'Hoje',
    duration: '0s',
  },
  {
    id: '2',
    name: 'Maria Silva',
    type: 'outgoing',
    missed: false,
    time: 'Ontem',
    date: '18:15',
    duration: '2m 45s',
  },
  {
    id: '3',
    name: 'Suporte Técnico',
    type: 'incoming',
    missed: false,
    time: 'Segunda-feira',
    date: '10:00',
    duration: '5m 12s',
  },
];

export default function CallsScreen() {
  const { colors, isDark } = useTheme();

  const renderItem = ({ item }: { item: typeof MOCK_CALLS[0] }) => (
    <TouchableOpacity 
      style={[styles.callItem, { borderBottomColor: colors.separator }]}
      onPress={() => Alert.alert('Chamada', `Iniciando chamada para ${item.name}...`)}
    >
      <Avatar name={item.name} size={50} />
      <View style={styles.callDetails}>
        <Text style={[styles.name, { color: item.missed ? '#FF3B30' : colors.textPrimary }]}>
          {item.name}
        </Text>
        <View style={styles.typeRow}>
          <MaterialIcons 
            name={item.type === 'incoming' ? 'call-received' : 'call-made'} 
            size={14} 
            color={item.missed ? '#FF3B30' : colors.textSecondary} 
          />
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {item.type === 'incoming' ? 'Recebida' : 'Realizada'} • {item.time} {item.date !== 'Hoje' ? `(${item.date})` : ''}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.infoButton}>
        <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chamadas</Text>
        <TouchableOpacity>
          <Ionicons name="add-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CALLS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="call-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma chamada recente
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => Alert.alert('Nova Chamada', 'Funcionalidade de nova chamada em breve!')}
      >
        <MaterialCommunityIcons name="phone-plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 100,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  callDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 13,
    marginLeft: 4,
  },
  infoButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
});
