---
description: Documentação dos endpoints da API e configuração de rede
---

# Configuração da API - Telegram Clone

Esta documentação descreve como configurar e utilizar os endpoints da API no projeto.

## Configuração de Rede

A URL base da API é configurada através da variável de ambiente no arquivo `.env`:

```env
EXPO_PUBLIC_CHAT_API_URL=http://localhost:3000
```

> [!TIP]
> No Android Emulator, use `http://10.0.2.2:3000` para acessar o localhost da máquina hospedeira.

## Endpoints Disponíveis (REST)

### Usuários e Autenticação
- `POST /api/users`: Registrar novo usuário.
- `POST /api/users/login`: Autenticar-se (gera o Token de acesso).
- `GET /api/users?q={busca}`: Listar usuários (com busca opcional).

### Conversas
- `GET /api/conversations/:userId`: Listar todas as conversas de um usuário logado.
- `POST /api/conversations`: Criar uma nova conversa com um participante (`participantId`).

### Mensagens
- `GET /api/messages/:conversationId`: Buscar o histórico de mensagens de uma conversa específica.
- `POST /api/messages`: Enviar uma mensagem (texto ou mídia) via REST.

### Mídia
- `POST /api/media/upload`: Endpoint para upload de arquivos (fotos/vídeos).

## Comunicação em Tempo Real (Socket.io)

O projeto utiliza o mesmo `BASE_URL` para as conexões via Socket.

### Eventos Principais
- **Emitir**:
    - `connect_user`: Registra o usuário no socket assim que ele loga.
    - `send_message`: Envia mensagens instantâneas.
- **Escutar**:
    - `receive_message`: Recebe mensagens novas em tempo real.

## Arquivos de Configuração
- [chatApiConfig.ts](file:///d:/AULA%20SENAC/AULA%20SENAC%20T%C3%89CNICO%20EM%20DESENVOLVIMENTODE%20SISTEMAS/telegram-clone-master/src/config/chatApiConfig.ts)
- [chatApi.ts](file:///d:/AULA%20SENAC/AULA%20SENAC%20T%C3%89CNICO%20EM%20DESENVOLVIMENTODE%20SISTEMAS/telegram-clone-master/src/services/chatApi.ts)
- [chatSocket.ts](file:///d:/AULA%20SENAC/AULA%20SENAC%20T%C3%89CNICO%20EM%20DESENVOLVIMENTODE%20SISTEMAS/telegram-clone-master/src/services/chatSocket.ts)
