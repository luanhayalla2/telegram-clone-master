/**
 * Utilitário de criptografia básica para as mensagens.
 * (Desafio 1 - Criptografia básica)
 */

// Chave estática para demonstração (em produção usaríamos chaves por conversa)
const SECRET_KEY = 'TELEGRAM_CLONE_SECURE';

export const encryptMessage = (text: string): string => {
  if (!text) return '';
  
  // Exemplo de criptografia Base64 customizada (simulando criptografia de ponta a ponta)
  // Em um app real, usaríamos bibliotecas como react-native-aes ou similar
  const encoded = btoa(unescape(encodeURIComponent(text)));
  return `[ENCRYPTED]${encoded}`;
};

export const decryptMessage = (encryptedText: string): string => {
  if (!encryptedText || !encryptedText.startsWith('[ENCRYPTED]')) return encryptedText;

  try {
    const encoded = encryptedText.replace('[ENCRYPTED]', '');
    const decoded = decodeURIComponent(escape(atob(encoded)));
    return decoded;
  } catch (e) {
    console.error('Falha ao descriptografar mensagem:', e);
    return '[Erro de descriptografia]';
  }
};
