const getEnv = (key: string, fallback = ''): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[ChatAPI] Variável de ambiente ausente: ${key}. Usando fallback: "${fallback}"`);
    return fallback;
  }
  return value;
};

export const CHAT_API_CONFIG = {
  BASE_URL: getEnv('EXPO_PUBLIC_CHAT_API_URL', 'http://localhost:3000'),
};
