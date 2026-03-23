// This file is disabled as the application is migrating to CometChat SDK.
// Use cometChatService.ts instead for chat operations.

export const chatAuthFirebase = async (payload: any): Promise<any> => {
  throw new Error('Migrated to CometChat. Use cometChatService.ts');
};

export const chatListUsers = async (q?: string): Promise<any[]> => {
  return [];
};

export const chatGetConversations = async (userId: string): Promise<any[]> => {
  return [];
};

export const chatCreateConversation = async (participantId: string): Promise<any> => {
  throw new Error('Migrated to CometChat. Use CometChat SDK');
};

export const chatGetMessages = async (conversationId: string): Promise<any[]> => {
  return [];
};

export const chatSendMessageRest = async (payload: any): Promise<any> => {
  throw new Error('Migrated to CometChat. Use CometChat SDK');
};

export const chatUploadMedia = async (file: any): Promise<any> => {
  throw new Error('Migrated to CometChat. Use CometChat SDK');
};


