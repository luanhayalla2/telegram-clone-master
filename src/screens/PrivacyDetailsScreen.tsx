import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyDetails'>;

const OPTIONS = [
  { id: 'Todos', label: 'Todos' },
  { id: 'Meus Contatos', label: 'Meus Contatos' },
  { id: 'Ninguém', label: 'Ninguém' },
];

export default function PrivacyDetailsScreen({ route }: Props) {
  const { title, settingKey } = route.params;
  const { colors } = useTheme();
  const settings = useSettings() as any;
  
  const currentValue = settings[settingKey];
  const setterName = `set${settingKey.charAt(0).toUpperCase()}${settingKey.slice(1)}`;
  const setter = settings[setterName];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: colors.textSecondary }]}>
            Quem pode ver meu {title.toLowerCase()}?
          </Text>
        </View>

        <View style={[styles.list, { backgroundColor: colors.surface }]}>
          {OPTIONS.map((opt, index) => {
            const isSelected = currentValue === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.item,
                  index < OPTIONS.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
                onPress={() => setter && setter(opt.id)}
              >
                <Text style={[styles.label, { color: colors.textPrimary }]}>{opt.label}</Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Você pode restringir quem vê seu {title.toLowerCase()} nas configurações acima.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, marginTop: 8 },
  headerText: { fontSize: 13, textTransform: 'uppercase', fontWeight: 'bold' },
  list: { marginTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  label: { fontSize: 17 },
  footer: { padding: 16 },
  footerText: { fontSize: 14, lineHeight: 20 },
});
