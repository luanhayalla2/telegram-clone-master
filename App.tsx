import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { COMETCHAT_CONSTANTS } from './src/config/cometChatConfig';
import { LogBox } from 'react-native';

// Ignorar avisos de depreciaÃ§Ã£o da biblioteca react-native-toast-message na web
LogBox.ignoreLogs([
  '"shadow*" style props are deprecated',
  'props.pointerEvents is deprecated'
]);

// Suprimir warnings na Web (react-native-web não obedece ao LogBox sempre)
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && (msg.includes('"shadow*" style props') || msg.includes('props.pointerEvents is deprecated'))) {
    return;
  }
  originalWarn(...args);
};
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import LoadingSpinner from './src/components/LoadingSpinner';
import useAuth from './src/hooks/useAuth';
import { setupNotifications, showMessageNotification } from './src/services/notificationService';
import Toast from 'react-native-toast-message';
import MessageToast from './src/components/MessageToast';
import { SettingsProvider } from './src/context/SettingsContext';
import { initCometChat } from './src/services/cometChatService';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    setupNotifications();
    initCometChat();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setChatReady(false);
      return;
    }
    // When authenticated, CometChat SDK connects automatically from cometChatService.ts
    setChatReady(true);
  }, [isAuthenticated]);

  if (authLoading || (isAuthenticated && !chatReady)) {
    return <LoadingSpinner message="Carregando..." />;
  }

  const toastConfig = {
    messageToast: (props: any) => <MessageToast {...props} />,
  };

  return (
    <SettingsProvider>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast config={toastConfig} />
    </SettingsProvider>
  );
}

