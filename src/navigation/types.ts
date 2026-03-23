export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Flows
  MainFlow: { screen?: string; params?: any };
  MainTabs:
    | {
        showChatActions?: boolean;
        onDeleteSelected?: () => void;
      }
    | undefined;

  // Screens
  ChatList: undefined;
  Chat: {
    conversationId: string;
    userId: string;
    name: string;
    avatar?: string | null;
  };
  Profile: { uid?: string };
  Settings: undefined;
  Contacts: undefined;
  Status: undefined;
  Calls: undefined;
  NewChat: undefined;
  NewGroup: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Privacy: undefined;
  DataStorage: undefined;
  Help: undefined;
  ChatSettings: undefined;
  Devices: undefined;
  PowerSaving: undefined;
  Language: undefined;
  Premium: undefined;
  Wallet: undefined;
  Business: undefined;
  BlockedUsers: undefined;
  PrivacyDetails: { title: string; settingKey: string; current: string };
  StorageUsage: undefined;
  NetworkUsage: undefined;
  ClearCache: undefined;
  ChatFolders: undefined;
  EditFolder: { folderId?: string };
};
