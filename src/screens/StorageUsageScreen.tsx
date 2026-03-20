import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

export default function StorageUsageScreen() {
  const { colors } = useTheme();

  const mockData = [
    { label: 'Fotos', size: '250 MB', color: '#007AFF' },
    { label: 'Vídeos', size: '850 MB', color: '#34C759' },
    { label: 'Arquivos', size: '120 MB', color: '#AF52DE' },
    { label: 'Outros', size: '45 MB', color: '#F7931A' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.chartContainer}>
          <View style={[styles.chartBar, { backgroundColor: colors.surface }]}>
            {mockData.map((item, index) => (
              <View 
                key={index} 
                style={{ 
                  flex: parseInt(item.size), 
                  backgroundColor: item.color,
                  height: '100%' 
                }} 
              />
            ))}
          </View>
          <View style={styles.legendContainer}>
            {mockData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.legendSize, { color: colors.textSecondary }]}>{item.size}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]}>
            <Text style={[styles.buttonText, { color: '#FF3B30' }]}>Limpar Tudo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chartContainer: { padding: 20, alignItems: 'center' },
  chartBar: { width: '100%', height: 20, borderRadius: 10, flexDirection: 'row', overflow: 'hidden', marginBottom: 20 },
  legendContainer: { width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  legendLabel: { flex: 1, fontSize: 16 },
  legendSize: { fontSize: 16, fontWeight: '500' },
  section: { padding: 20 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 17, fontWeight: '600' },
});
