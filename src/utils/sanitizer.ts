/**
 * Sanitiza o conteúdo de mensagens no frontend para evitar injeção de scripts (XSS).
 * (Atividade 3 - Sanitização de Mensagens no Frontend)
 */
export const sanitizeFrontendMessage = (text: string): string => {
  if (!text) return '';

  // 1. Remover tags HTML básicas (prevenção contra injeção de HTML/scripts)
  // Como não temos dompurify no React Native, usamos uma abordagem baseada em regex
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
  const tagRegex = /<[^>]*>?/gm;

  // Primeiro removemos os scripts totalmente (incluindo o conteúdo)
  let result = text.replace(scriptRegex, '');
  
  // Depois removemos quaisquer outras tags HTML remanescentes
  result = result.replace(tagRegex, '');

  return result.trim();
};
