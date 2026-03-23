import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

type Plan = 'monthly' | 'yearly';

const PLANS: Record<Plan, { label: string; price: string; perMonth: string; save?: string }> = {
  monthly: { label: 'Mensal', price: 'R$ 19,90', perMonth: 'R$ 19,90/mês' },
  yearly: { label: 'Anual', price: 'R$ 179,00', perMonth: 'R$ 14,90/mês', save: 'Economize 25%' },
};

const PREMIUM_FEATURES = [
  {
    id: '1',
    title: 'Dobro de Limites',
    desc: 'Até 1000 canais, 20 pastas, 10 chats fixados e muito mais.',
    icon: 'layers-outline',
    color: '#AF52DE',
    detail: 'Com o Premium, seus limites dobram: 1000 canais seguidos, 20 pastas de chats, 10 chats fixados, e muito mais. Organize da forma que preferir.',
  },
  {
    id: '2',
    title: 'Voz para Texto',
    desc: 'Transcrição instantânea de qualquer mensagem de voz.',
    icon: 'mic-outline',
    color: '#FF9500',
    detail: 'Converta mensagens de voz em texto automaticamente. Ideal para situações onde não pode ouvir o áudio imediatamente.',
  },
  {
    id: '3',
    title: 'Download Mais Rápido',
    desc: 'Sem limites de velocidade para arquivos e mídia.',
    icon: 'download-outline',
    color: '#34C759',
    detail: 'Baixe arquivos e mídias na velocidade máxima da sua conexão, sem throttling ou filas de espera.',
  },
  {
    id: '4',
    title: 'Tradução em Real-Time',
    desc: 'Traduza chats e canais inteiros enquanto lê.',
    icon: 'language-outline',
    color: '#007AFF',
    detail: 'Traduza mensagens de qualquer idioma diretamente no chat, em tempo real, sem sair da conversa.',
  },
  {
    id: '5',
    title: 'Stickers e Reações Premium',
    desc: 'Efeitos exclusivos e stickers em tela cheia.',
    icon: 'star-outline',
    color: '#FF2D55',
    detail: 'Acesse centenas de stickers e reações exclusivos do Premium, incluindo efeitos em tela cheia para momentos especiais.',
  },
  {
    id: '6',
    title: 'Gerenciamento de Chats',
    desc: 'Defina pastas padrão e arquivamento automático.',
    icon: 'folder-open-outline',
    color: '#5856D6',
    detail: 'Crie pastas personalizadas para organizar seus chats, defina regras de arquivamento automático e mantenha tudo em ordem.',
  },
  {
    id: '7',
    title: 'Badge de Inscrito',
    desc: 'Um ícone premium exclusivo ao lado do seu nome.',
    icon: 'ribbon-outline',
    color: '#FFD60A',
    detail: 'Exiba o distintivo Premium ao lado do seu nome em todos os chats, grupos e canais. Seja reconhecido pela comunidade.',
  },
  {
    id: '8',
    title: 'Fotos de Perfil Animadas',
    desc: 'Vídeos de perfil em loops em todos os chats.',
    icon: 'videocam-outline',
    color: '#64D2FF',
    detail: 'Defina um vídeo curto como sua foto de perfil. Ele será exibido em loop para todos os seus contatos.',
  },
  {
    id: '9',
    title: 'Sem Anúncios',
    desc: 'Experiência totalmente limpa em canais públicos.',
    icon: 'close-circle-outline',
    color: '#8E8E93',
    detail: 'Elimine todos os anúncios patrocinados de canais públicos e tenha uma experiência limpa e sem interrupções.',
  },
];

export default function PremiumScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { isPremium, setIsPremium } = useSettings();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.15, duration: 180, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const handleSubscribe = () => {
    if (isPremium) {
      Alert.alert(
        'Cancelar Assinatura',
        'Tem certeza que deseja cancelar o Telegram Premium? Você perderá todos os benefícios.',
        [
          { text: 'Manter Premium', style: 'cancel' },
          {
            text: 'Cancelar Assinatura',
            style: 'destructive',
            onPress: () => {
              setIsPremium(false);
              Alert.alert('Assinatura cancelada', 'Sua assinatura foi cancelada com sucesso.');
            },
          },
        ]
      );
      return;
    }

    const plan = PLANS[selectedPlan];
    Alert.alert(
      'Confirmar Assinatura',
      `Plano ${plan.label}\n${plan.price}\n(${plan.perMonth})\n\nDeseja continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Assinar Agora',
          onPress: () => {
            startPulse();
            setIsPremium(true);
            Alert.alert('🎉 Bem-vindo ao Premium!', 'Você agora tem acesso a todos os recursos exclusivos do Telegram Premium.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const toggleFeature = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const surfaceColor = isDark ? '#1C1C1E' : '#F2F2F7';
  const cardColor = isDark ? '#2C2C2E' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1a0a2e' : '#f0e6ff' }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#AF52DE" />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.starRing}>
              <Ionicons name="star" size={56} color="#FFD60A" />
            </View>
          </Animated.View>
          <Text style={styles.headerTitle}>Telegram Premium</Text>
          <Text style={[styles.headerSub, { color: isDark ? '#C9A7F0' : '#7B4FB5' }]}>
            Apoie o Telegram e ganhe acesso a recursos exclusivos.
          </Text>
          {isPremium && (
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.activeBadgeText}>Assinatura Ativa</Text>
            </View>
          )}
        </View>

        {/* Plan Selector */}
        {!isPremium && (
          <View style={[styles.planContainer, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ESCOLHA SEU PLANO</Text>
            <View style={styles.planRow}>
              {(Object.keys(PLANS) as Plan[]).map((key) => {
                const plan = PLANS[key];
                const isSelected = selectedPlan === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.planCard,
                      { backgroundColor: cardColor, borderColor: isSelected ? '#AF52DE' : 'transparent', borderWidth: 2 },
                    ]}
                    onPress={() => setSelectedPlan(key)}
                    activeOpacity={0.8}
                  >
                    {plan.save && (
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveBadgeText}>{plan.save}</Text>
                      </View>
                    )}
                    <Text style={[styles.planLabel, { color: isSelected ? '#AF52DE' : colors.textSecondary }]}>{plan.label}</Text>
                    <Text style={[styles.planPrice, { color: colors.textPrimary }]}>{plan.price}</Text>
                    <Text style={[styles.planPerMonth, { color: colors.textSecondary }]}>{plan.perMonth}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#AF52DE" style={styles.planCheck} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>RECURSOS INCLUÍDOS</Text>
          <View style={[styles.featureCard, { backgroundColor: surfaceColor }]}>
            {PREMIUM_FEATURES.map((feature, index) => {
              const isExpanded = expandedId === feature.id;
              const isLast = index === PREMIUM_FEATURES.length - 1;
              return (
                <View key={feature.id}>
                  <TouchableOpacity
                    style={[styles.featureRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator }]}
                    onPress={() => toggleFeature(feature.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconBox, { backgroundColor: feature.color + '22' }]}>
                      <Ionicons name={feature.icon as any} size={22} color={feature.color} />
                    </View>
                    <View style={styles.featureText}>
                      <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                      <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{feature.desc}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={[styles.featureDetail, { backgroundColor: feature.color + '11' }]}>
                      <Text style={[styles.featureDetailText, { color: colors.textPrimary }]}>{feature.detail}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.separator }]}>
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: isPremium ? '#FF3B30' : '#AF52DE' }]}
          onPress={handleSubscribe}
          activeOpacity={0.85}
        >
          <Ionicons name={isPremium ? 'close-circle-outline' : 'star'} size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.subscribeText}>
            {isPremium ? 'Cancelar Assinatura' : `Assinar ${PLANS[selectedPlan].label} — ${PLANS[selectedPlan].price}`}
          </Text>
        </TouchableOpacity>
        {!isPremium && (
          <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
            Renova automaticamente. Cancele quando quiser.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Back button
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 4,
    zIndex: 10,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  starRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#AF52DE22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#AF52DE',
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 14,
    gap: 6,
  },
  activeBadgeText: { color: '#FFF', fontWeight: '600', fontSize: 14 },

  // Plans
  planContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 14,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  planRow: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  saveBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  saveBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  planLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  planPrice: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  planPerMonth: { fontSize: 11 },
  planCheck: { position: 'absolute', top: 8, right: 8 },

  // Features
  featuresSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  featureCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  featureDesc: { fontSize: 13, lineHeight: 17 },
  featureDetail: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featureDetailText: { fontSize: 13, lineHeight: 19 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 6 },
      web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
    }),
  },
  subscribeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerNote: { fontSize: 12, textAlign: 'center', marginTop: 8 },
});
