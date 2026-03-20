import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings, ChatFolder } from '../context/SettingsContext';

const TYPE_OPTIONS = [
  { id: 'private', label: 'Contatos', icon: 'person-outline' },
  { id: 'groups', label: 'Grupos', icon: 'people-outline' },
  { id: 'channels', label: 'Canais', icon: 'megaphone-outline' },
  { id: 'bots', label: 'Bots', icon: 'logo-android' },
];

export default function EditFolderScreen({ route, navigation }: any) {
  const { folderId } = route.params || {};
  const { colors } = useTheme();
  const { chatFolders, setChatFolders } = useSettings();

  const existingFolder = chatFolders.find(f => f.id === folderId);

  const [name, setName] = useState(existingFolder?.name || '');
  const [includedTypes, setIncludedTypes] = useState<string[]>(existingFolder?.includedTypes || []);

  const toggleType = (id: string) => {
    setIncludedTypes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a pasta.");
      return;
    }

    if (includedTypes.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um tipo de chat.");
      return;
    }

    const newFolder: ChatFolder = {
      id: folderId || Date.now().toString(),
      name,
      icon: 'folder-outline',
      includedTypes,
      excludedChats: [],
      includedChats: [],
    };

    if (folderId) {
      setChatFolders(chatFolders.map(f => f.id === folderId ? newFolder : f));
    } else {
      setChatFolders([...chatFolders, newFolder]);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>NOME DA PASTA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Ex: Trabalho, Família..."
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>CHATS INCLUÍDOS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {TYPE_OPTIONS.map((type, index) => {
              const isSelected = includedTypes.includes(type.id);
              return (
                <TouchableOpacity 
                  key={type.id} 
                  style={[
                    styles.typeItem,
                    index < TYPE_OPTIONS.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                  ]}
                  onPress={() => toggleType(type.id)}
                >
                  <View style={styles.typeInfo}>
                    <Ionicons name={type.icon as any} size={24} color={colors.textSecondary} style={{ marginRight: 16 }} />
                    <Text style={[styles.typeName, { color: colors.textPrimary }]}>{type.label}</Text>
                  </View>
                  <Ionicons 
                    name={isSelected ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={isSelected ? colors.primary : colors.textSecondary} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Salvar Pasta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { backgroundColor: '#FFF' },
  input: { padding: 16, fontSize: 17 },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
  },
  typeInfo: { flexDirection: 'row', alignItems: 'center' },
  typeName: { fontSize: 17 },
  footer: { padding: 20, marginTop: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
