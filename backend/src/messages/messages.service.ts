import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import * as createDOMPurify from 'dompurify';

@Injectable()
export class MessagesService {
  private readonly window: any;
  private readonly DOMPurify: any;

  constructor() {
    this.window = new JSDOM('').window;
    this.DOMPurify = createDOMPurify(this.window);
  }

  // 3. Sanitizacao de Mensagens (Atividade 3)
  sanitizeMessageContent(text: string): string {
    if (!text) return '';
    
    // Purificar HTML para evitar ataques XSS
    const sanitizedContent = this.DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // No tags allowed (pure text only)
      ALLOWED_ATTR: [],
    });

    return sanitizedContent.trim();
  }

  async createMessage(userId: string, conversationId: string, content: string) {
    const safeContent = this.sanitizeMessageContent(content);
    
    // Log da acao importante (Atividade 7)
    console.log(`[SECURITY LOG] Mensagem enviada por ${userId} na conversa ${conversationId}: ${safeContent.substring(0, 20)}...`);

    // Aqui iria o codigo do MongoDB para salvar a mensagem...
    return {
      userId,
      conversationId,
      content: safeContent,
      createdAt: new Date(),
    };
  }
}
