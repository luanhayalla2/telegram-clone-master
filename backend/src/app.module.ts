import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, MessagesService, ChatGateway],
})
export class AppModule implements NestModule {
  // 7. Logs de Segurança globais (Atividade 7)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
