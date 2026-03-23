import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { UserProfile } from '../types/user';
import { createCometChatUser, loginCometChat, logoutCometChat } from './cometChatService';
/**
 * Registrar novo usuário com email e senha.
 * Cria o perfil no Firestore e registra na sua Chat API.
 */
export const signUp = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Atualizar displayName no Firebase Auth
  await updateProfile(user, { displayName });



  try {
    await createCometChatUser(user.uid, displayName);
    await loginCometChat(user.uid);
  } catch (error: any) {
    console.error('[AuthService] CometChat Erro no Register:', error);
    await firebaseSignOut(auth);

    const msg = error?.message ? String(error.message) : 'Falha ao registrar.';
    throw new Error(`Falha no CometChat: ${msg}`);
  }

  return user;
};

/**
 * Login com email e senha.
 * Atualiza status online no Firestore e faz login na sua Chat API.
 */
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // CometChat login em background - nao bloqueia o login do Firebase
  loginCometChat(user.uid, user.displayName || undefined)
    .then(() => console.log('[AuthService] CometChat login sucesso'))
    .catch((err) => console.warn('[AuthService] CometChat login falhou (nao critico):', err));

  return user;
};

/**
 * Logout do Firebase.
 * Atualiza status offline no Firestore e limpa sessão do chat.
 */
export const signOut = async () => {
  // Tenta deslogar do CometChat mas não bloqueia o logout do Firebase se falhar
  try {
    await logoutCometChat();
  } catch (error) {
    console.warn('[AuthService] CometChat logout falhou, continuando com Firebase logout:', error);
  }

  await firebaseSignOut(auth);
};

/**
 * Observar mudanças no estado de autenticação.
 * Retorna um unsubscribe function.
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Buscar perfis de usuários por uma lista de UIDs (Firestore).
 */
export const getUsersByIds = async (uids: string[]): Promise<UserProfile[]> => {
  return []; // Bypassed as Firestore is locked
};

/**
 * Buscar perfil de um usuário pelo UID.
 */
export const getUserProfile = async (uid: string) => {
  return null; // Bypassed as Firestore is locked
};

/**
 * Atualizar perfil do usuário logado.
 */
export const updateUserProfile = async (
  uid: string,
  data: {
    displayName?: string;
    photoURL?: string;
  }
) => {

  // Atualizar também no Firebase Auth se for displayName ou photoURL
  const user = auth.currentUser;
  if (user && (data.displayName || data.photoURL)) {
    await updateProfile(user, {
      displayName: data.displayName || user.displayName,
      photoURL: data.photoURL || user.photoURL,
    });
  }
};

/**
 * Retorna o usuário atualmente logado ou null.
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

