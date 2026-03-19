import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [val1, setVal1] = React.useState(true);
  const [val2, setVal2] = React.useState(true);
  const [val3, setVal3] = React.useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>NOTIFICAÇÕES DE CHATS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="person" iconBgColor="#007AFF" label="Chats Privados" subtitle="Ativado" onPress={() => {}} />
            <SettingRow iconName="people" iconBgColor="#34C759" label="Grupos" subtitle="Ativado" onPress={() => {}} />
            <SettingRow iconName="megaphone" iconBgColor="#AF52DE" label="Canais" subtitle="Ativado" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>CHAMADAS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="call" iconBgColor="#34C759" label="Vibração" subtitle="Padrão" onPress={() => {}} />
            <SettingRow iconName="musical-notes" iconBgColor="#F7931A" label="Toque" subtitle="Padrão" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>OUTROS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="sync" iconBgColor="#64D2FF" label="Sincronizar Contatos" subtitle="Ativado" onPress={() => {}} />
            <SettingRow iconName="eye" iconBgColor="#5856D6" label="Pré-visualização" subtitle="Ativado" onPress={() => {}} isLast />
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
