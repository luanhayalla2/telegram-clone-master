import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ChatsService } from './chats.service';

// 2. Proteção de Rotas com Auth Guard (Atividade 2)
// O @UseGuards(FirebaseAuthGuard) garante que NENHUMA rota seja acessada sem token válido
@UseGuards(FirebaseAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // 1. Token Firebase validado pelo guard em toda rota (Atividade 1)
  // 6. Controle de Acesso: usuário só acessa seus próprios chats (Atividade 6)
  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: string, @Request() req: any) {
    // O uid vem do token já validado pelo FirebaseAuthGuard
    const userId: string = req.user.uid;

    // O ChatsService valida se o usuário é participante antes de retornar dados
    return this.chatsService.getChatMessages(userId, chatId);
  }

  // Rota para listar chats do usuário autenticado
  @Get()
  async listChats(@Request() req: any) {
    const userId: string = req.user.uid;
    console.log(`[SECURITY LOG] Usuário ${userId} listou seus chats`);
    // Retornaria a lista de chats do MongoDB filtrada pelo userId
    return [];
  }
}
