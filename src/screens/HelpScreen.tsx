import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';

export default function HelpScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SUPORTE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="help-circle" 
              iconBgColor="#007AFF" 
              label="Telegram FAQ" 
              onPress={() => Linking.openURL('https://telegram.org/faq')} 
            />
            <SettingRow 
              iconName="chatbubble-ellipses" 
              iconBgColor="#34C759" 
              label="Fazer uma Pergunta" 
              onPress={() => {}} 
            />
            <SettingRow 
              iconName="shield-checkmark" 
              iconBgColor="#F7931A" 
              label="Política de Privacidade" 
              onPress={() => {}} 
              isLast 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SOBRE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="information-circle" iconBgColor="#AF52DE" label="Versão do Aplicativo" subtitle="v1.0.0" onPress={() => {}} />
            <SettingRow iconName="code-working" iconBgColor="#5856D6" label="Código Fonte" onPress={() => {}} isLast />
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
