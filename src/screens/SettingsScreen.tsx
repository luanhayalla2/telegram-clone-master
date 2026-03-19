import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatSettings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>MENSAGENS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="send" iconBgColor="#007AFF" label="Pressionar Enter para Enviar" onPress={() => {}} />
            <SettingRow iconName="brush" iconBgColor="#F7931A" label="Tamanho do Texto" subtitle="16pt" onPress={() => {}} />
            <SettingRow iconName="image" iconBgColor="#34C759" label="Papel de Parede do Chat" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>MIDIA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="play-circle" iconBgColor="#AF52DE" label="Auto-reproduzir GIFs" onPress={() => {}} />
            <SettingRow iconName="videocam" iconBgColor="#FF3B30" label="Auto-reproduzir Vídeos" onPress={() => {}} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>OPÇÕES DE NOME</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="person-circle" iconBgColor="#64D2FF" label="Mostrar Nome e Foto" onPress={() => {}} />
            <SettingRow iconName="text" iconBgColor="#5856D6" label="Usar Nomes Curtos" onPress={() => {}} isLast />
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
