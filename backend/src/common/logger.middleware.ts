import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // 7. Logs de Segurança (Atividade 7)
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      // Log detalhado para auditoria de segurança
      console.log(
        `[SECURITY LOG] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
      );

      // Detectar possíveis ataques ou erros frequentes
      if (statusCode >= 400 && statusCode < 500) {
        console.warn(`[SECURITY WARNING] Possível tentativa de acesso inválida vinda de ${ip}: ${originalUrl}`);
      }
    });

    next();
  }
}
