/**
 * Converte códigos de erro do Firebase e outras APIs em mensagens legíveis para o usuário.
 * (Atividade 5 - Tratamento de Erros no Frontend)
 */
export const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return 'Ocorreu um erro desconhecido.';

  const code = error.code || error.message || '';
  const message = error.message ? String(error.message).toLowerCase() : '';

  // Firebase Auth Errors
  if (code.includes('auth/invalid-email') || message.includes('invalid email')) {
    return 'O endereço de e-mail não é válido.';
  }
  if (code.includes('auth/user-disabled') || message.includes('user disabled')) {
    return 'Esta conta foi desativada.';
  }
  if (code.includes('auth/user-not-found') || message.includes('user not found')) {
    return 'Não encontramos uma conta com este e-mail.';
  }
  if (code.includes('auth/wrong-password') || message.includes('wrong password')) {
    return 'Senha incorreta. Tente novamente.';
  }
  if (code.includes('auth/email-already-in-use') || message.includes('email already in use')) {
    return 'Este e-mail já está sendo usado por outra conta.';
  }
  if (code.includes('auth/weak-password') || message.includes('weak password')) {
    return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
  }

  // Network Errors
  if (message.includes('network request failed') || message.includes('failed to fetch')) {
    return 'Erro de conexão. Verifique sua internet.';
  }

  // CometChat / Generic Errors
  if (message.includes('cometchat')) {
    return 'Erro no serviço de chat. Tente novamente em alguns instantes.';
  }

  return 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';
};
