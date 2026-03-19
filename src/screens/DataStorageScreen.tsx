import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';

export default function DataStorageScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>USO DE DISCO E REDE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="pie-chart" iconBgColor="#007AFF" label="Uso do Armazenamento" subtitle="1.2 GB" onPress={() => {}} />
            <SettingRow iconName="stats-chart" iconBgColor="#34C759" label="Uso da Rede" subtitle="450 MB" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>DOWNLOAD AUTOMÁTICO DE MÍDIA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="cellular" iconBgColor="#34C759" label="Ao usar Dados Móveis" subtitle="Fotos" onPress={() => {}} />
            <SettingRow iconName="wifi" iconBgColor="#007AFF" label="Ao usar Wi-Fi" subtitle="Todos os arquivos" onPress={() => {}} />
            <SettingRow iconName="airplane" iconBgColor="#AF52DE" label="Em Roaming" subtitle="Desativado" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>OUTROS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="save" iconBgColor="#F7931A" label="Salvar na Galeria" subtitle="Desativado" onPress={() => {}} />
            <SettingRow iconName="trash" iconBgColor="#FF3B30" label="Limpar Cache" onPress={() => {}} isLast />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
});
