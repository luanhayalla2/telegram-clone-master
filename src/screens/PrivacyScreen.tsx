import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';

export default function PrivacyScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>PRIVACIDADE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="person-remove" iconBgColor="#FF3B30" label="Usuários Bloqueados" subtitle="0" onPress={() => {}} />
            <SettingRow iconName="call" iconBgColor="#34C759" label="Número de Telefone" subtitle="Meus Contatos" onPress={() => {}} />
            <SettingRow iconName="time" iconBgColor="#007AFF" label="Visto por Último" subtitle="Todos" onPress={() => {}} />
            <SettingRow iconName="camera" iconBgColor="#AF52DE" label="Foto de Perfil" subtitle="Todos" onPress={() => {}} />
            <SettingRow iconName="mail" iconBgColor="#F7931A" label="Mensagens Encaminhadas" subtitle="Todos" onPress={() => {}} />
            <SettingRow iconName="people" iconBgColor="#5856D6" label="Grupos e Canais" subtitle="Todos" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SEGURANÇA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="keypad" iconBgColor="#64D2FF" label="Senha de Bloqueio" subtitle="Desativado" onPress={() => {}} />
            <SettingRow iconName="shield-checkmark" iconBgColor="#34C759" label="Verificação em Duas Etapas" subtitle="Ativado" onPress={() => {}} isLast />
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
