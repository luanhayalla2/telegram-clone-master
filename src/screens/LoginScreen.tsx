import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { signIn } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ─── Tipos de erro que o sistema pode retornar ───────────────────────────────
type LoginError = {
  field?: 'email' | 'password' | 'general';
  message: string;
};

// ─── Componente de campo com erro inline ──────────────────────────────────────
function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
      />
      {/* 5. Tratamento de Erros — mensagem inline no campo (Atividade 5) */}
      {error ? (
        <Text style={styles.fieldError}>
          <Ionicons name="alert-circle-outline" size={12} /> {error}
        </Text>
      ) : null}
    </View>
  );
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Desafio 2 — Modal de 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);

  // ─── Validação local antes de chamar a API ─────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await signIn(email.trim(), password);
      // Sucesso: a navegação é gerenciada pelo AuthContext automaticamente
    } catch (error: any) {
      // 5. Tratamento de Erros (Atividade 5)
      if (error.code === 'auth/2fa-required') {
        // Desafio 2 — Exibe modal de verificação em duas etapas
        setPendingUser(error.user);
        setShow2FAModal(true);
        setLoading(false);
        return;
      }
      // Exibe mensagem amigável gerada pelo getFriendlyErrorMessage (authService)
      setErrors({ general: error.message || 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Desafio 2 — Validação simplificada do código 2FA
  const handle2FAVerify = async () => {
    if (twoFACode.length < 4) {
      Alert.alert('Código inválido', 'O código deve ter pelo menos 4 dígitos.');
      return;
    }

    // Simula verificação: código hardcoded "1234" para demonstração
    // Em produção: verificaria via Firebase phoneAuth ou TOTP (ex: speakeasy)
    if (twoFACode === '1234') {
      console.log('[SECURITY] 2FA verificado com sucesso para:', pendingUser?.uid);
      setShow2FAModal(false);
      setTwoFACode('');
      // Navegação tratada pelo AuthContext
    } else {
      Alert.alert('Código Incorreto', 'O código de verificação informado está errado.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <Ionicons name="chatbubble-ellipses" size={62} color={colors.primary} style={styles.logo} />
          <Text style={styles.title}>Telegram Clone</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          <InputField
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <InputField
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          {/* 5. Erro geral com destaque visual (Atividade 5) */}
          {errors.general ? (
            <View style={styles.generalErrorBox}>
              <Ionicons name="warning-outline" size={16} color="#c0392b" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* ─── Desafio 2: Modal de Autenticação em Dois Fatores ─────────────── */}
      <Modal
        visible={show2FAModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShow2FAModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary} />
            <Text style={styles.modalTitle}>Verificação em Duas Etapas</Text>
            <Text style={styles.modalSubtitle}>
              Digite o código de verificação enviado para o seu dispositivo.
            </Text>
            <TextInput
              style={styles.codeInput}
              value={twoFACode}
              onChangeText={setTwoFACode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
              placeholderTextColor={colors.textSecondary}
              textAlign="center"
            />
            <TouchableOpacity style={styles.button} onPress={handle2FAVerify} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShow2FAModal(false)} style={{ marginTop: 12 }}>
              <Text style={[styles.footerLink, { fontSize: 14 }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: 4,
  },
  input: {
    height: 52,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  fieldError: {
    color: '#e74c3c',
    fontSize: 12,
    marginLeft: 4,
  },
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  generalErrorText: {
    color: '#c0392b',
    fontSize: 14,
    flex: 1,
  },
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Modal 2FA
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeInput: {
    height: 60,
    width: '70%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
