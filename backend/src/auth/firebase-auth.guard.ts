import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Validação do Token no Backend (Atividade 1)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido ou inválido');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Validar token com Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Anexar o usuário decodificado à requisição
      request.user = decodedToken;
      
      return true;
    } catch (error) {
      console.error('Erro na validação do token Firebase:', error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
