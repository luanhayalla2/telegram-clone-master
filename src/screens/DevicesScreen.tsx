import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const MOCK_SESSIONS = [
  { id: '1', name: 'Telegram Web', browser: 'Chrome 122.0', location: 'São Paulo, Brasil', ip: '189.121.xx.xx', date: 'Hoje, 14:35', icon: 'desktop-outline' },
  { id: '2', name: 'Xiaomi Mi 11', browser: 'Telegram Android 10.9.1', location: 'Rio de Janeiro, Brasil', ip: '177.34.xx.xx', date: 'Ontem, 09:22', icon: 'phone-portrait-outline' },
];

export default function DevicesScreen() {
  const { colors } = useTheme();

  const handleLinkDevice = () => {
    Alert.alert("Link Desktop", "Aponte sua câmera para o QR code no Telegram Desktop ou Telegram Web.");
  };

  const handleTerminateAll = () => {
    Alert.alert(
      "Encerrar Sessões",
      "Deseja encerrar todas as outras sessões, exceto esta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Encerrar", style: "destructive", onPress: () => Alert.alert("Sucesso", "Todas as outras sessões foram encerradas.") }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="laptop-outline" size={80} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Seus Dispositivos</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            Gerencie suas sessões ativas e vincule novos dispositivos do desktop scanneando um QR Code.
          </Text>
        </View>

        <TouchableOpacity style={styles.linkButton} onPress={handleLinkDevice}>
          <Ionicons name="qr-code" size={24} color={colors.primary} />
          <Text style={[styles.linkText, { color: colors.primary }]}>Vincular Dispositivo</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>ESTE DISPOSITIVO</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.sessionItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={Platform.OS === 'ios' ? "phone-portrait-outline" : "logo-android"} size={24} color={colors.primary} />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={[styles.deviceName, { color: colors.textPrimary }]}>Este {Platform.OS === 'ios' ? 'iPhone' : 'Android'}</Text>
                <Text style={[styles.deviceSub, { color: colors.textSecondary }]}>Telegram Clone v1.0.0 • Online</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>OUTRAS SESSÕES</Text>
            <TouchableOpacity onPress={handleTerminateAll}>
              <Text style={{ color: '#FF3B30', fontSize: 13, fontWeight: 'bold', marginRight: 16 }}>ENCERRAR TODAS</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {MOCK_SESSIONS.map((session, index) => (
              <TouchableOpacity 
                key={session.id} 
                style={[
                  styles.sessionItem,
                  index < MOCK_SESSIONS.length - 1 && { borderBottomColor: colors.separator, borderBottomWidth: StyleSheet.hairlineWidth }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                  <Ionicons name={session.icon as any} size={24} color={colors.textSecondary} />
                </View>
                <View style={styles.sessionInfo}>
                  <View style={styles.deviceNameRow}>
                    <Text style={[styles.deviceName, { color: colors.textPrimary }]}>{session.name}</Text>
                    <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>{session.date}</Text>
                  </View>
                  <Text style={[styles.deviceSub, { color: colors.textSecondary }]}>{session.browser}</Text>
                  <Text style={[styles.deviceSub, { color: colors.textSecondary }]}>{session.location} • {session.ip}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={{ padding: 20 }}>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Por segurança, você pode encerrar sessões que não reconhece ou que não usa mais.
          </Text>
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
  linkButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(79, 124, 255, 0.1)', 
    margin: 16, 
    padding: 16, 
    borderRadius: 12,
    justifyContent: 'center'
  },
  linkText: { fontSize: 17, fontWeight: '700', marginLeft: 12 },
  section: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { backgroundColor: '#FFF' },
  sessionItem: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sessionInfo: { flex: 1 },
  deviceNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deviceName: { fontSize: 17, fontWeight: '600' },
  deviceSub: { fontSize: 13, marginTop: 2 },
  sessionDate: { fontSize: 13 },
  tipText: { fontSize: 13, textAlign: 'center', marginTop: 16 }
});
