import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChatsService {
  private readonly chats = [
    { id: 'chat1', participants: ['userA', 'userB'] },
    { id: 'chat2', participants: ['userB', 'userC'] },
  ];

  // 6. Controle de Acesso (Atividade 6)
  async getChatMessages(userId: string, chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);

    if (!chat) {
      throw new NotFoundException('Chat não encontrado');
    }

    // Garantir que o usuário só acesse seus próprios chats
    if (!chat.participants.includes(userId)) {
      console.warn(`[SECURITY ALERT] Tentativa de acesso não autorizada: Usuário ${userId} tentou acessar o chat ${chatId}`);
      throw new ForbiddenException('Acesso negado: você não é um participante deste chat');
    }

    console.log(`[SECURITY LOG] Usuário ${userId} acessou o chat ${chatId}`);
    
    // Retornaria as mensagens do MongoDB
    return []; 
  }
}
