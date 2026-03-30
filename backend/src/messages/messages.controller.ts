import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { MessagesService } from './messages.service';

// 2. Proteção de Rotas (Atividade 2) — guard aplicado no controller
@UseGuards(FirebaseAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // 1. Token validado + 3. Sanitização + 7. Log de ações (Atividades 1, 3 e 7)
  @Post()
  async sendMessage(
    @Body() body: { conversationId: string; content: string },
    @Request() req: any,
  ) {
    const userId: string = req.user.uid;
    const { conversationId, content } = body;

    // Sanitização + persistência (MessagesService já sanitiza o conteúdo)
    return this.messagesService.createMessage(userId, conversationId, content);
  }
}
