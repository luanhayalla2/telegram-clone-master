import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 4. Autenticacao no WebSocket (Atividade 4)
  async handleConnection(client: Socket) {
    const token = client.handshake.headers['authorization']?.split(' ')[1];

    if (!token) {
      console.warn(`[SECURITY ALERT] Tentativa de conexao WebSocket sem token por ${client.id}`);
      client.disconnect();
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      client.data.user = decodedToken;
      console.log(`[SECURITY LOG] WebSocket conectado: Usuário ${decodedToken.uid} (${client.id})`);
    } catch (error) {
      console.error('[SECURITY ERROR] Falha na autenticação do WebSocket:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[SECURITY LOG] WebSocket desconectado: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() payload: any) {
    // 6. Controle de Acesso e 3. Sanitização tambem seriam aplicados aqui
    console.log(`[SECURITY LOG] Mensagem recebida via WebSocket de ${payload.senderId}`);
    return { event: 'message_received', data: payload };
  }
}
