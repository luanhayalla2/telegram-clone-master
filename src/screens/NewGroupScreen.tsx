import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import useTheme from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { CometChat } from '@cometchat/chat-sdk-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGroup'>;

export default function NewGroupScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    const groupName = name.trim();
    if (!groupName) {
      if (Platform.OS === 'web') window.alert('Aviso: Informe um nome para o grupo.');
      else Alert.alert('Aviso', 'Informe um nome para o grupo.');
      return;
    }

    setCreating(true);
    try {
      const GUID = 'group_' + Date.now();
      const groupType = CometChat.GROUP_TYPE.PUBLIC;
      const password = '';

      const group = new CometChat.Group(GUID, groupName, groupType, password);

      const createdGroup = await CometChat.createGroup(group);
      
      if (Platform.OS === 'web') window.alert(`Grupo "${groupName}" criado com sucesso!`);
      else Alert.alert('Sucesso', `O grupo "${groupName}" foi criado.`);
      
      navigation.navigate('Chat', {
        conversationId: createdGroup.getGuid(),
        userId: createdGroup.getGuid(), // Usando GUID como ID único
        name: createdGroup.getName(),
        avatar: null,
      });
    } catch (error: any) {
      console.error('Erro ao criar grupo CometChat:', error);
      const msg = error?.message || 'Erro desconhecido ao criar grupo.';
      if (Platform.OS === 'web') window.alert(`Erro: ${msg}`);
      else Alert.alert('Erro ao criar grupo', msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Nome do grupo</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.inputBackground,
              borderColor: colors.separator,
            },
          ]}
          placeholder="Ex: Time do Projeto"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          maxLength={80}
          autoFocus
          editable={!creating}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: creating ? 0.7 : 1 }]}
          activeOpacity={0.85}
          onPress={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.textOnPrimary }]}>Criar Grupo</Text>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Os grupos criados aqui serão públicos e visíveis para todos os usuários no momento.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: { height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 16, marginBottom: 24 },
  button: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700' },
  hint: { marginTop: 20, textAlign: 'center', fontSize: 13, lineHeight: 18, opacity: 0.8 },
});
