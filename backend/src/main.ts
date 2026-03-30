import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

async function bootstrap() {
  // Inicialização do Firebase Admin
  // IMPORTANTE: Em produção, usar credenciais de arquivo .json
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const app = await NestFactory.create(AppModule);

  // 3. Sanitização & Validação Global (Atividade 3-5)
  // O ValidationPipe ajuda a evitar payloads maliciosos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS para o frontend (Segurança)
  app.enableCORS();

  await app.listen(3000);
  console.log('Backend listening on http://localhost:3000');
}
bootstrap();
