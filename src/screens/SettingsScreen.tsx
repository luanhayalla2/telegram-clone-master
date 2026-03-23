import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import useTheme from '../hooks/useTheme';
import SettingRow from '../components/SettingRow';
import MessageBubble from '../components/MessageBubble';
import { useSettings } from '../context/SettingsContext';
import { signOut } from '../services/authService';
import { Platform } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatSettings'>;

const WALLPAPER_COLORS = [
  '#090b12', '#1a201b', '#2a1a1a', '#1a2a2a', '#2a2a1a', '#2a1a2a', 
  '#3a3a3a', '#1e3a5f', '#1e5f3a', '#5f1e1e'
];

export default function SettingsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { 
    sendOnEnter, setSendOnEnter,
    textSize, setTextSize,
    chatWallpaper, setChatWallpaper,
    autoPlayGifs, setAutoPlayGifs,
    autoPlayVideos, setAutoPlayVideos,
    showNameAndPhoto, setShowNameAndPhoto,
    useShortNames, setUseShortNames
  } = useSettings();

  const handleLogout = () => {
    const confirmLogout = () => {
      signOut();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente sair da sua conta?')) {
        confirmLogout();
      }
    } else {
      Alert.alert(
        'Sair',
        'Deseja realmente sair da sua conta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: confirmLogout },
        ]
      );
    }
  };

  const handleAdjustTextSize = (amount: number) => {
    const newSize = Math.max(12, Math.min(30, textSize + amount));
    setTextSize(newSize);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        {/* Preview Section */}
        <View style={[styles.previewArea, { backgroundColor: chatWallpaper || colors.backgroundChat }]}>
          <MessageBubble 
            message="Este é um exemplo de como suas mensagens aparecerão no chat." 
            isMine={true} 
            timestamp={Date.now()} 
            textSize={textSize}
          />
          <MessageBubble 
            message="Você pode ajustar o tamanho do texto e o papel de parede abaixo." 
            isMine={false} 
            senderName="Telegram"
            timestamp={Date.now()} 
            textSize={textSize}
            showNameAndPhoto={showNameAndPhoto}
            useShortNames={useShortNames}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>MENSAGENS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="folder-outline" iconBgColor="#AF52DE" label="Pastas de Chat" onPress={() => navigation.navigate('ChatFolders')} />
            <SettingRow iconName="laptop-outline" iconBgColor="#34C759" label="Dispositivos" onPress={() => navigation.navigate('Devices')} />
            <SettingRow iconName="battery-charging" iconBgColor="#32D74B" label="Economia de Energia" onPress={() => navigation.navigate('PowerSaving')} />
            <SettingRow iconName="star" iconBgColor="#AF52DE" label="Telegram Premium" onPress={() => navigation.navigate('Premium')} />
            <SettingRow iconName="briefcase-outline" iconBgColor="#007AFF" label="Telegram Business" onPress={() => navigation.navigate('Business')} />
            <SettingRow iconName="wallet-outline" iconBgColor="#5856D6" label="Carteira" onPress={() => navigation.navigate('Wallet')} />
            <SettingRow 
              iconName="send" 
              iconBgColor="#007AFF" 
              label="Pressionar Enter para Enviar" 
              showSwitch 
              switchValue={sendOnEnter}
              onSwitchChange={setSendOnEnter}
            />
            
            <View style={styles.inlineSettingRow}>
              <View style={[styles.iconContainer, { backgroundColor: "#F7931A" }]}>
                <Ionicons name="brush" size={18} color="#FFF" />
              </View>
              <View style={styles.content}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Tamanho do Texto</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{textSize}pt</Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => handleAdjustTextSize(-1)} style={styles.controlBtn}>
                  <Ionicons name="remove-circle-outline" size={28} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAdjustTextSize(1)} style={styles.controlBtn}>
                  <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.separator }]} />

            <View style={styles.wallpaperSection}>
              <View style={styles.wallpaperHeader}>
                <View style={[styles.iconContainer, { backgroundColor: "#34C759" }]}>
                  <Ionicons name="image" size={18} color="#FFF" />
                </View>
                <Text style={[styles.label, { color: colors.textPrimary, marginLeft: 16 }]}>Papel de Parede</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wallpaperPalette}>
                {WALLPAPER_COLORS.map(color => (
                  <TouchableOpacity 
                    key={color} 
                    onPress={() => setChatWallpaper(color)}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      chatWallpaper === color && { borderColor: colors.primary, borderWidth: 3 }
                    ]} 
                  />
                ))}
                <TouchableOpacity 
                    onPress={() => setChatWallpaper(null)}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
                      chatWallpaper === null && { borderColor: colors.primary, borderWidth: 3 }
                    ]} 
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>MIDIA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="play-circle" 
              iconBgColor="#AF52DE" 
              label="Auto-reproduzir GIFs" 
              showSwitch
              switchValue={autoPlayGifs}
              onSwitchChange={setAutoPlayGifs}
            />
            <SettingRow 
              iconName="videocam" 
              iconBgColor="#FF3B30" 
              label="Auto-reproduzir Vídeos" 
              showSwitch
              switchValue={autoPlayVideos}
              onSwitchChange={setAutoPlayVideos}
              isLast 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>OPÇÕES DE NOME</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="person-circle" 
              iconBgColor="#64D2FF" 
              label="Mostrar Nome e Foto" 
              showSwitch
              switchValue={showNameAndPhoto}
              onSwitchChange={setShowNameAndPhoto}
            />
            <SettingRow 
              iconName="text" 
              iconBgColor="#5856D6" 
              label="Usar Nomes Curtos" 
              showSwitch
              switchValue={useShortNames}
              onSwitchChange={setUseShortNames}
              isLast 
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>AJUDA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="chatbubble-outline" iconBgColor="#34C759" label="Fazer uma Pergunta" onPress={() => Alert.alert('Suporte', 'Deseja iniciar um chat com o suporte?', [{text: 'Cancelar'}, {text: 'Sim', onPress: () => {}}])} />
            <SettingRow iconName="shield-checkmark-outline" iconBgColor="#5AC8FA" label="Política de Privacidade" onPress={() => navigation.navigate('Privacy')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SOBRE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow iconName="information-circle-outline" iconBgColor="#8E8E93" label="Versão do Aplicativo" rightText="10.9.3 (4728)" onPress={() => {}} />
            <SettingRow iconName="code-slash-outline" iconBgColor="#34C759" label="Código Fonte" onPress={() => {}} />
            <SettingRow 
              iconName="log-out-outline" 
              iconBgColor="#FF3B30" 
              label="Sair da Conta" 
              labelStyle={{ color: '#FF3B30' }} 
              onPress={handleLogout} 
              isLast
            />
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  previewArea: {
    height: 180,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  inlineSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  label: { fontSize: 16 },
  subtitle: { fontSize: 13, marginTop: 2 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    padding: 4,
    marginLeft: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64,
  },
  wallpaperSection: {
    padding: 16,
  },
  wallpaperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wallpaperPalette: {
    flexDirection: 'row',
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
});
