import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

const PREMIUM_FEATURES = [
  { id: '1', title: 'Dobro de Limites', desc: 'Até 1000 canais, 20 pastas, 10 chats fixados e muito mais.', icon: 'layers-outline', color: '#AF52DE' },
  { id: '2', title: 'Voz para Texto', desc: 'Transcrição instantânea de qualquer mensagem de voz.', icon: 'mic-outline', color: '#FF9500' },
  { id: '3', title: 'Download Mais Rápido', desc: 'Sem limites de velocidade para arquivos e mídia.', icon: 'download-outline', color: '#34C759' },
  { id: '4', title: 'Tradução em Real-Time', desc: 'Traduza chats e canais inteiros enquanto lê.', icon: 'language-outline', color: '#007AFF' },
  { id: '5', title: 'Stickers e Reações Premium', desc: 'Efeitos exclusivos e stickers em tela cheia.', icon: 'star-outline', color: '#FF2D55' },
  { id: '6', title: 'Gerenciamento de Chats', desc: 'Defina pastas padrão e arquivamento automático.', icon: 'folder-open-outline', color: '#5856D6' },
  { id: '7', title: 'Badge de Inscrito', desc: 'Um ícone premium exclusivo ao lado do seu nome.', icon: 'ribbon-outline', color: '#FFD60A' },
  { id: '8', title: 'Fotos de Perfil Animadas', desc: 'Vídeos de perfil em loops em todos os chats.', icon: 'videocam-outline', color: '#64D2FF' },
  { id: '9', title: 'Sem Anúncios', desc: 'Experiência totalmente limpa em canais públicos.', icon: 'close-circle-outline', color: '#8E8E93' },
];

export default function PremiumScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { isPremium, setIsPremium } = useSettings();

  const handleSubscribe = () => {
    if (isPremium) {
      Alert.alert("Premium", "Você já é um assinante Premium!");
      return;
    }

    Alert.alert(
      "Confirmar Assinatura",
      "Deseja assinar o Telegram Premium por R$ 19,90 / mês?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Assinar", 
          onPress: () => {
            setIsPremium(true);
            Alert.alert("Parabéns!", "Agora você é um usuário Premium!");
            navigation.goBack();
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.starContainer}>
            <Ionicons name="star" size={100} color="#AF52DE" style={styles.starIcon} />
            <View style={[styles.starGlow, { backgroundColor: '#AF52DE' }]} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Telegram Premium</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Apoie o Telegram e ganhe acesso a recursos exclusivos.
          </Text>
        </View>

        <View style={styles.featuresList}>
          {PREMIUM_FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={[styles.iconBox, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.separator }]}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeText}>
            {isPremium ? 'Assinatura Ativa' : 'Assinar por R$ 19,90 / mês'}
          </Text>
        </TouchableOpacity>
        {!isPremium && <Text style={[styles.footerText, { color: colors.textSecondary }]}>Renova mensalmente. Cancele quando quiser.</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 32, paddingTop: 16 },
  starContainer: { position: 'relative', marginBottom: 24 },
  starIcon: { zIndex: 2 },
  starGlow: { 
    position: 'absolute', 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    top: 10, 
    left: 10, 
    opacity: 0.3, 
    transform: [{ scale: 1.5 }] 
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  featuresList: { paddingHorizontal: 20 },
  featureItem: { flexDirection: 'row', marginBottom: 24, alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  featureDesc: { fontSize: 13, lineHeight: 18 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 16, 
    paddingBottom: 32, 
    borderTopWidth: StyleSheet.hairlineWidth 
  },
  subscribeButton: { 
    backgroundColor: '#34C759', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 6 }
    })
  },
  subscribeText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  footerText: { fontSize: 12, textAlign: 'center', marginTop: 12 }
});
