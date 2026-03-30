import { io, Socket } from 'socket.io-client';
import { CHAT_API_CONFIG } from '../config/chatApiConfig';
import type { ChatApiMessage } from '../types/chatApi';

// 4. Autenticação no WebSocket (Atividade 4)
// O token Firebase é enviado no handshake para que o backend valide antes de conectar
import { auth } from '../config/firebaseConfig';

type ReceiveMessageHandler = (message: ChatApiMessage | any) => void;

let socket: Socket | null = null;
let currentUserId: string | null = null;
const receiveHandlers = new Set<ReceiveMessageHandler>();

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

/**
 * Obtém o ID Token atual do Firebase (validade: 1h).
 * Retorna null se o usuário não estiver autenticado.
 */
const getFirebaseToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  } catch (e) {
    console.warn('[ChatSocket] Não foi possível obter o token Firebase:', e);
    return null;
  }
};

export const connectChatSocket = async (userId: string) => {
  if (socket && currentUserId === userId) {
    return socket;
  }

  disconnectChatSocket();

  // 4. Busca o token do Firebase para autenticar o WebSocket
  const token = await getFirebaseToken();
  if (!token) {
    console.error('[ChatSocket] Conexão recusada: usuário não autenticado no Firebase.');
    return null;
  }

  currentUserId = userId;
  socket = io(normalizeBaseUrl(CHAT_API_CONFIG.BASE_URL), {
    transports: ['websocket'],
    autoConnect: true,
    // Envia o Bearer token no handshake — validado pelo ChatGateway
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('[ChatSocket] Conectado com autenticação Firebase.');
    socket?.emit('connect_user', userId);
  });

  socket.on('connect_error', (err) => {
    console.error('[ChatSocket] Falha na conexão autenticada:', err.message);
  });

  for (const handler of receiveHandlers) {
    socket.on('receive_message', handler);
  }

  return socket;
};

export const disconnectChatSocket = () => {
  if (!socket) {
    currentUserId = null;
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  currentUserId = null;
};

export const onReceiveMessage = (handler: ReceiveMessageHandler) => {
  receiveHandlers.add(handler);
  socket?.on('receive_message', handler);

  return () => {
    receiveHandlers.delete(handler);
    socket?.off('receive_message', handler);
  };
};

export const sendMessageSocket = (payload: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
}) => {
  if (!socket) {
    throw new Error('Socket não conectado. Faça login novamente.');
  }

  // 3. Sanitização no frontend antes de enviar (Atividade 3)
  if (payload.text) {
    // Remove scripts e HTML antes de enviar ao servidor
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
    const tagRegex = /<[^>]*>?/gm;
    payload.text = payload.text.replace(scriptRegex, '').replace(tagRegex, '').trim();
  }

  socket.emit('send_message', payload);
};

export const isSocketConnected = () => {
  return !!socket?.connected;
};
