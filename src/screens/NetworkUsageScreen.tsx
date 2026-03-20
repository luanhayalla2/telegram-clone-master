import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

export default function NetworkUsageScreen() {
  const { colors } = useTheme();

  const sections = [
    {
      title: 'DADOS MÓVEIS',
      items: [
        { label: 'Enviado', value: '45.2 MB', icon: 'arrow-up' },
        { label: 'Recebido', value: '312.8 MB', icon: 'arrow-down' },
      ]
    },
    {
      title: 'WI-FI',
      items: [
        { label: 'Enviado', value: '1.2 GB', icon: 'arrow-up' },
        { label: 'Recebido', value: '8.5 GB', icon: 'arrow-down' },
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {section.items.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.item,
                    index < section.items.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                  ]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                    <Text style={[styles.label, { color: colors.textPrimary }]}>{item.label}</Text>
                  </View>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  labelContainer: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 17 },
  value: { fontSize: 17, fontWeight: '500' },
});
