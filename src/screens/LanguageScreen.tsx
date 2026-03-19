import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

const LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português (Brasil)' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
  { id: 'fr', name: 'French', nativeName: 'Français' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский' },
];

export default function LanguageScreen() {
  const { colors } = useTheme();
  const { language, setLanguage } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: colors.textSecondary }]}>
            Escolha o idioma para a interface do aplicativo.
          </Text>
        </View>

        <View style={[styles.list, { backgroundColor: colors.surface }]}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = language === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.item,
                  index < LANGUAGES.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
                onPress={() => setLanguage(lang.id as any)}
              >
                <View>
                  <Text style={[styles.langName, { color: colors.textPrimary }]}>{lang.nativeName}</Text>
                  <Text style={[styles.langSub, { color: colors.textSecondary }]}>{lang.name}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 14,
  },
  list: {
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 60,
  },
  langName: {
    fontSize: 17,
  },
  langSub: {
    fontSize: 13,
    marginTop: 2,
  },
});
