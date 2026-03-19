// Configurações do Firebase
// Preencha com as credenciais do seu projeto Firebase

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  // @ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Firebase] Variavel de ambiente ausente: ${key}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  // Tenta obter a instância já inicializada (evita erro auth/already-initialized)
  auth = getAuth(app);
} catch (e) {
  // Se não existir, inicializa com a persistência adequada
  if (Platform.OS === 'web') {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  }
}

export { auth };
export const db = getFirestore(app);
export default app;

