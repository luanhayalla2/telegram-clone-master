import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

const BUSINESS_FEATURES = [
  { id: '1', title: 'Horário de Funcionamento', desc: 'Exiba quando sua empresa está aberta.', icon: 'time-outline', color: '#007AFF' },
  { id: '2', title: 'Respostas Rápidas', desc: 'Atalhos para mensagens frequentes.', icon: 'flash-outline', color: '#FF9500' },
  { id: '3', title: 'Mensagem de Saudação', desc: 'Boas-vindas automática para novos clientes.', icon: 'chatbox-outline', color: '#34C759' },
  { id: '4', title: 'Mensagem de Ausência', desc: 'Responda quando não estiver disponível.', icon: 'moon-outline', color: '#AF52DE' },
  { id: '5', title: 'Localização e Contato', desc: 'Seu endereço e site em destaque no perfil.', icon: 'map-outline', color: '#FF3B30' },
  { id: '6', title: 'Etiquetas de Chat', desc: 'Organize conversas com Tags coloridas.', icon: 'pricetag-outline', color: '#5856D6' },
  { id: '7', title: 'Links de Chat Direto', desc: 'Crie links para seus clientes iniciarem chat.', icon: 'link-outline', color: '#64D2FF' },
  { id: '8', title: 'Chatbots de Negócios', desc: 'Integre bots avançados de atendimento.', icon: 'construct-outline', color: '#FFD60A' },
];

export default function BusinessScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { isBusiness, setIsBusiness } = useSettings();

  const handleJoinBusiness = () => {
    if (isBusiness) {
      Alert.alert("Telegram Business", "Você já utiliza o modo Business!");
      return;
    }

    Alert.alert(
      "Ativar Telegram Business",
      "Deseja ativar o modo Business para gerenciar sua empresa pelo Telegram?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Ativar", 
          onPress: () => {
            setIsBusiness(true);
            Alert.alert("Sucesso!", "O modo Business foi ativado na sua conta.");
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
          <View style={styles.iconContainer}>
            <Ionicons name="briefcase" size={100} color="#007AFF" />
            <View style={[styles.glow, { backgroundColor: '#007AFF' }]} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Telegram Business</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ferramentas profissionais para gerenciar sua empresa e atender clientes.
          </Text>
        </View>

        <View style={styles.featuresList}>
          {BUSINESS_FEATURES.map((feature) => (
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
        <TouchableOpacity style={styles.actionButton} onPress={handleJoinBusiness}>
          <Text style={styles.actionText}>
            {isBusiness ? 'Gerenciar Empresa' : 'Começar a Usar Agora'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 32, paddingTop: 16 },
  iconContainer: { position: 'relative', marginBottom: 24 },
  glow: { 
    position: 'absolute', 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    top: 10, 
    left: 10, 
    opacity: 0.2, 
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
  actionButton: { 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center'
  },
  actionText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' }
});
