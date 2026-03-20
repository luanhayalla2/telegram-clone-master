import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';
import { useSettings } from '../context/SettingsContext';

export default function PrivacyScreen({ navigation }: any) {
  const { colors } = useTheme();
  const {
    blockedUsers,
    phoneNumberPrivacy,
    lastSeenPrivacy,
    profilePhotoPrivacy,
    forwardedMessagesPrivacy,
    groupsChannelsPrivacy,
    passcodeEnabled, setPasscodeEnabled,
    twoStepVerificationEnabled, setTwoStepVerificationEnabled,
  } = useSettings();

  const handlePressPrivacy = (title: string, settingKey: string, current: string) => {
    navigation.navigate('PrivacyDetails', { title, settingKey, current });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>PRIVACIDADE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="person-remove" 
              iconBgColor="#FF3B30" 
              label="Usuários Bloqueados" 
              subtitle={String(blockedUsers.length)} 
              onPress={() => navigation.navigate('BlockedUsers')} 
            />
            <SettingRow 
              iconName="call" 
              iconBgColor="#34C759" 
              label="Número de Telefone" 
              subtitle={phoneNumberPrivacy} 
              onPress={() => handlePressPrivacy("Número de Telefone", "phoneNumberPrivacy", phoneNumberPrivacy)} 
            />
            <SettingRow 
              iconName="time" 
              iconBgColor="#007AFF" 
              label="Visto por Último" 
              subtitle={lastSeenPrivacy} 
              onPress={() => handlePressPrivacy("Visto por Último", "lastSeenPrivacy", lastSeenPrivacy)} 
            />
            <SettingRow 
              iconName="camera" 
              iconBgColor="#AF52DE" 
              label="Foto de Perfil" 
              subtitle={profilePhotoPrivacy} 
              onPress={() => handlePressPrivacy("Foto de Perfil", "profilePhotoPrivacy", profilePhotoPrivacy)} 
            />
            <SettingRow 
              iconName="mail" 
              iconBgColor="#F7931A" 
              label="Mensagens Encaminhadas" 
              subtitle={forwardedMessagesPrivacy} 
              onPress={() => handlePressPrivacy("Mensagens Encaminhadas", "forwardedMessagesPrivacy", forwardedMessagesPrivacy)} 
            />
            <SettingRow 
              iconName="people" 
              iconBgColor="#5856D6" 
              label="Grupos e Canais" 
              subtitle={groupsChannelsPrivacy} 
              onPress={() => handlePressPrivacy("Grupos e Canais", "groupsChannelsPrivacy", groupsChannelsPrivacy)} 
              isLast 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SEGURANÇA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="keypad" 
              iconBgColor="#64D2FF" 
              label="Senha de Bloqueio" 
              showSwitch
              switchValue={passcodeEnabled}
              onSwitchChange={setPasscodeEnabled}
            />
            <SettingRow 
              iconName="shield-checkmark" 
              iconBgColor="#34C759" 
              label="Verificação em Duas Etapas" 
              showSwitch
              switchValue={twoStepVerificationEnabled}
              onSwitchChange={setTwoStepVerificationEnabled}
              isLast 
            />
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
