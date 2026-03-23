import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
  { id: '1', type: 'received', amount: '45.00', from: 'Alice Smith', date: 'Hoje, 14:20' },
  { id: '2', type: 'sent', amount: '12.50', to: 'Coffee Shop', date: 'Ontem, 09:15' },
  { id: '3', type: 'received', amount: '150.00', from: 'Trabalho', date: '21 de Março' },
];

export default function WalletScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 12, padding: 4 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 12, padding: 4 }} 
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Configurações da Carteira: Opções de segurança e limites em breve!');
            } else {
              Alert.alert('Configurações', 'Opções de segurança e limites da carteira.');
            }
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleAction = (action: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${action}: Funcionalidade financeira em implementação segura.`);
    } else {
      Alert.alert(action, 'Esta funcionalidade será liberada após verificação de identidade.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Card de Saldo */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.balanceLabel}>Saldo Principal</Text>
            <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.balanceAmount}>R$ 2.450,75</Text>
          <Text style={styles.balanceSub}>+R$ 120,00 esta semana</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Adicionar Saldo')}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons name="add" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Adicionar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Enviar Dinheiro')}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons name="arrow-up" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Enviar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Trocar Cripto')}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Trocar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Atividade Recente</Text>
            <TouchableOpacity onPress={() => handleAction('Ver histórico completo')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {TRANSACTIONS.map((tx, index) => (
              <TouchableOpacity 
                key={tx.id} 
                style={[
                  styles.txItem, 
                  index !== TRANSACTIONS.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
                onPress={() => handleAction('Detalhes da Transação')}
              >
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
                <Text style={[styles.txAmount, { color: tx.type === 'received' ? '#34C759' : colors.textPrimary, fontWeight: 'bold' }]}>
                  {tx.type === 'received' ? '+' : '-'} R$ {tx.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ativos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4, marginBottom: 12 }]}>Seus Ativos</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.assetItem} onPress={() => handleAction('Gerenciar Bitcoin')}>
              <View style={[styles.assetIcon, { backgroundColor: '#F7931A' }]}>
                <Ionicons name="logo-bitcoin" size={24} color="#FFF" />
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetTitle, { color: colors.textPrimary }]}>Bitcoin</Text>
                <Text style={[styles.assetSymbol, { color: colors.textSecondary }]}>BTC</Text>
              </View>
              <View style={styles.assetBalance}>
                <Text style={[styles.assetAmount, { color: colors.textPrimary }]}>0.0045 BTC</Text>
                <Text style={[styles.assetValue, { color: '#34C759' }]}>R$ 1.250,00</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.separator }]} />

            <TouchableOpacity style={styles.assetItem} onPress={() => handleAction('Gerenciar Ethereum')}>
              <View style={[styles.assetIcon, { backgroundColor: '#627EEA' }]}>
                <Ionicons name="diamond-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetTitle, { color: colors.textPrimary }]}>Ethereum</Text>
                <Text style={[styles.assetSymbol, { color: colors.textSecondary }]}>ETH</Text>
              </View>
              <View style={styles.assetBalance}>
                <Text style={[styles.assetAmount, { color: colors.textPrimary }]}>0.85 ETH</Text>
                <Text style={[styles.assetValue, { color: '#34C759' }]}>R$ 8.420,00</Text>
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
  scrollContent: { paddingBottom: 40 },
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 24,
    minHeight: 200,
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 10 },
      web: { boxShadow: '0px 8px 16px rgba(0,0,0,0.2)' }
    })
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: '800', marginVertical: 4 },
  balanceSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: { alignItems: 'center', flex: 1 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  card: { borderRadius: 16, overflow: 'hidden' },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, marginLeft: 12 },
  txTitle: { fontSize: 15, fontWeight: '700' },
  txDate: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15 },
  assetItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  assetIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  assetInfo: { flex: 1, marginLeft: 12 },
  assetTitle: { fontSize: 16, fontWeight: '700' },
  assetSymbol: { fontSize: 12, marginTop: 2 },
  assetBalance: { alignItems: 'flex-end' },
  assetAmount: { fontSize: 15, fontWeight: '700' },
  assetValue: { fontSize: 13, marginTop: 2 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 72 },
});
