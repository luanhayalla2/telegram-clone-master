import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
  { id: '1', type: 'received', amount: '45.00', from: 'Alice Smith', date: 'Hoje, 14:20' },
  { id: '2', type: 'sent', amount: '12.50', to: 'Coffee Shop', date: 'Ontem, 09:15' },
  { id: '3', type: 'received', amount: '150.00', from: 'Work Bonus', date: '21 de Março' },
];

export default function WalletScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <Text style={styles.balanceAmount}>R$ 2.450,75</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="arrow-up" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Trocar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Transações Recentes</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {TRANSACTIONS.map((tx, index) => (
              <View key={tx.id} style={[styles.txItem, index !== TRANSACTIONS.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'received' ? '#34C75920' : '#FF3B3020' }]}>
                  <Ionicons 
                    name={tx.type === 'received' ? 'arrow-down' : 'arrow-up'} 
                    size={20} 
                    color={tx.type === 'received' ? '#34C759' : '#FF3B30'} 
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: colors.textPrimary }]}>
                    {tx.type === 'received' ? `De: ${tx.from}` : `Para: ${tx.to}`}
                  </Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'received' ? '#34C759' : colors.textPrimary }]}>
                  {tx.type === 'received' ? '+' : '-'} R$ {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Seus Ativos</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.assetItem}>
              <View style={[styles.assetIcon, { backgroundColor: '#F7931A' }]}>
                <Ionicons name="logo-bitcoin" size={24} color="#FFF" />
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetTitle, { color: colors.textPrimary }]}>Bitcoin</Text>
                <Text style={[styles.assetSymbol, { color: colors.textSecondary }]}>BTC</Text>
              </View>
              <View style={styles.assetBalance}>
                <Text style={[styles.assetAmount, { color: colors.textPrimary }]}>0.0045 BTC</Text>
                <Text style={[styles.assetValue, { color: colors.textSecondary }]}>R$ 1.250,00</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  balanceCard: { margin: 16, padding: 24, borderRadius: 24, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 8 },
  balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 24 },
  actionButton: { alignItems: 'center' },
  actionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  card: { borderRadius: 16, overflow: 'hidden' },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: '500' },
  txDate: { fontSize: 13, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  assetItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  assetIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  assetInfo: { flex: 1 },
  assetTitle: { fontSize: 16, fontWeight: 'bold' },
  assetSymbol: { fontSize: 13 },
  assetBalance: { alignItems: 'flex-end' },
  assetAmount: { fontSize: 15, fontWeight: '600' },
  assetValue: { fontSize: 13 }
});
