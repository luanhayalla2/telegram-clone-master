import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const CACHE_CATEGORIES = [
  { id: 'photos', label: 'Fotos', size: '250 MB', defaultChecked: true },
  { id: 'videos', label: 'Vídeos', size: '850 MB', defaultChecked: true },
  { id: 'files', label: 'Arquivos', size: '120 MB', defaultChecked: true },
  { id: 'other', label: 'Outros', size: '45 MB', defaultChecked: false },
];

export default function ClearCacheScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<string[]>(
    CACHE_CATEGORIES.filter(c => c.defaultChecked).map(c => c.id)
  );

  const toggleSelected = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleClear = () => {
    if (selected.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos uma categoria para limpar.");
      return;
    }

    Alert.alert(
      "Limpar Cache",
      `Deseja limpar ${selected.length} categorias selecionadas?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar", 
          style: "destructive", 
          onPress: () => {
            Alert.alert("Sucesso", "Cache selecionado foi limpo!");
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const totalSize = CACHE_CATEGORIES
    .filter(c => selected.includes(c.id))
    .reduce((acc, curr) => {
      const sizeVal = parseFloat(curr.size);
      return acc + (curr.size.includes('GB') ? sizeVal * 1024 : sizeVal);
    }, 0);

  const formattedTotal = totalSize >= 1024 
    ? `${(totalSize / 1024).toFixed(1)} GB` 
    : `${totalSize.toFixed(0)} MB`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="trash-outline" size={64} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Limpar Cache</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            Selecione o que deseja remover do armazenamento local.
          </Text>
        </View>

        <View style={[styles.list, { backgroundColor: colors.surface }]}>
          {CACHE_CATEGORIES.map((cat, index) => {
            const isSelected = selected.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.item,
                  index < CACHE_CATEGORIES.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
                onPress={() => toggleSelected(cat.id)}
              >
                <View style={styles.itemRow}>
                  <Ionicons 
                    name={isSelected ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={isSelected ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[styles.label, { color: colors.textPrimary }]}>{cat.label}</Text>
                </View>
                <Text style={[styles.size, { color: colors.textSecondary }]}>{cat.size}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={handleClear}
          >
            <Text style={styles.buttonText}>Limpar {formattedTotal}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subText: { fontSize: 13, textAlign: 'center' },
  list: { marginTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 17, marginLeft: 16 },
  size: { fontSize: 16 },
  footer: { padding: 20, marginTop: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
