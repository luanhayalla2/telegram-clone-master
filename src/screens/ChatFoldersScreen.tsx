import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings, ChatFolder } from '../context/SettingsContext';

export default function ChatFoldersScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { chatFolders, setChatFolders } = useSettings();

  const handleCreateFolder = () => {
    navigation.navigate('EditFolder', {});
  };

  const handleDeleteFolder = (folder: ChatFolder) => {
    if (folder.id === 'all_chats') {
      Alert.alert("Erro", "A pasta padrão não pode ser excluída.");
      return;
    }

    Alert.alert(
      "Excluir Pasta",
      `Deseja excluir a pasta "${folder.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            setChatFolders(chatFolders.filter(f => f.id !== folder.id));
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="folder-open-outline" size={64} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Pastas de Chat</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            Crie pastas para diferentes grupos de chats e alterne rapidamente entre eles.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SUAS PASTAS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {chatFolders.map((folder, index) => (
              <View 
                key={folder.id} 
                style={[
                  styles.folderItem,
                  index < chatFolders.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
              >
                <TouchableOpacity 
                  style={styles.folderInfo} 
                  onPress={() => navigation.navigate('EditFolder', { folderId: folder.id })}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name={folder.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.folderName, { color: colors.textPrimary }]}>{folder.name}</Text>
                    <Text style={[styles.folderCount, { color: colors.textSecondary }]}>
                      {folder.includedTypes.length + folder.includedChats.length} tipos/chats
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteFolder(folder)}>
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={[styles.createText, { color: colors.primary }]}>Criar Nova Pasta</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>PASTAS RECOMENDADAS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.recommendedItem}>
              <View style={styles.folderInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#34C75920' }]}>
                  <Ionicons name="mail-unread-outline" size={20} color="#34C759" />
                </View>
                <View>
                  <Text style={[styles.folderName, { color: colors.textPrimary }]}>Não Lidas</Text>
                  <Text style={[styles.folderCount, { color: colors.textSecondary }]}>Todos os chats com novas mensagens</Text>
                </View>
              </View>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subText: { fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { marginHorizontal: 0, overflow: 'hidden' },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
  },
  folderInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  folderName: { fontSize: 17, fontWeight: '500' },
  folderCount: { fontSize: 13 },
  createButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    justifyContent: 'center',
    marginTop: 8
  },
  createText: { fontSize: 17, fontWeight: '600', marginLeft: 8 },
  recommendedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
  }
});
