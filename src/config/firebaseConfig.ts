// Configurações do Firebase
// Preencha com as credenciais do seu projeto Firebase

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  Auth,
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
    console.warn(`[Firebase] Variavel de ambiente ausente: ${key}. O app pode não funcionar corretamente.`);
    return '';
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

let app: any;
let auth: any;
let db: any;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    
    try {
      auth = getAuth(app);
    } catch (e) {
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
    db = getFirestore(app);
  } catch (error) {
    console.error('[Firebase] Erro ao inicializar SDK:', error);
  }
} else {
  console.warn('[Firebase] SDK não inicializado por falta de chaves. Usando Mocks.');
  // Mocks básicos para evitar crash em outras partes do app
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
      cb(null);
      return () => {};
    },
    signOut: async () => {},
  };
  db = {};
}

export { auth, db };
export default app;

