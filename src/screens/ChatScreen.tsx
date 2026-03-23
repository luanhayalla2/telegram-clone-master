import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { RootStackParamList } from '../navigation/types';
import { spacing } from '../theme/spacing';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Avatar from '../components/Avatar';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import useAuth from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type MessageType = {
  id: string;
  text: string;
  senderId: string;
  createdAt: number;
  isMine: boolean;
};

export default function ChatScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { textSize, chatWallpaper, showNameAndPhoto, useShortNames } = useSettings();
  const { conversationId, userId: receiverUid, name, avatar } = route.params;
  const { uid: myUid } = useAuth();

  const flatListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleWrap}>
          <Avatar name={name} size={38} uri={avatar ?? null} online={false} />
          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerName, { color: colors.textPrimary }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.headerStatus, { color: colors.textSecondary }]} numberOfLines={1}>
              online
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.alert(`Iniciando chamada de voz para ${name}...`);
              } else {
                Alert.alert('Chamada', `Deseja ligar para ${name}?`);
              }
            }}
          >
            <Ionicons name="call-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.alert('Menu da conversa: Opções de limpar chat e silenciar em breve!');
              } else {
                Alert.alert('Opções', 'Limpar histórico, Silenciar notificações, etc.');
              }
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.textPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, name, colors.background, colors.textPrimary, colors.textSecondary, avatar]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(receiverUid)
        .setLimit(50)
        .build();
      
      const fetched = await messagesRequest.fetchPrevious();
      const mapped: MessageType[] = (fetched as any[]).map(m => ({
        id: m.id.toString(),
        text: m.text || (m.data?.text || ''),
        senderId: m.sender?.uid || '',
        createdAt: m.sentAt,
        isMine: m.sender?.uid === myUid?.toLowerCase(),
      })).filter(m => m.text);
      
      setMessages(mapped);
    } catch (error) {
      console.error('Erro ao carregar mensagens CometChat:', error);
    } finally {
      setLoading(false);
    }
  }, [receiverUid, myUid]);

  useEffect(() => {
    loadMessages();
    
    // Listener para mensagens em tempo real
    const listenerSettings = new CometChat.MessageListener({
      onTextMessageReceived: (textMessage: any) => {
        if (textMessage.sender.uid === receiverUid.toLowerCase()) {
          setMessages(prev => [...prev, {
            id: textMessage.id.toString(),
            text: textMessage.text,
            senderId: textMessage.sender.uid,
            createdAt: textMessage.sentAt,
            isMine: false,
          }]);
        }
      }
    });
    
    const listenerID = 'CHAT_SCREEN_LISTENER_' + receiverUid;
    CometChat.addMessageListener(listenerID, listenerSettings);
    
    return () => {
      CometChat.removeMessageListener(listenerID);
    };
  }, [loadMessages, receiverUid]);

  const handleSend = useCallback(async (text: string) => {
    try {
      const textMessage = new CometChat.TextMessage(
        receiverUid,
        text,
        CometChat.RECEIVER_TYPE.USER
      );
      
      const sentMessage: any = await CometChat.sendMessage(textMessage);
      setMessages(prev => [...prev, {
        id: sentMessage.id.toString(),
        text: sentMessage.text,
        senderId: sentMessage.sender.uid,
        createdAt: sentMessage.sentAt,
        isMine: true,
      }]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem CometChat:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    }
  }, [receiverUid]);

  const renderMessage = ({ item }: { item: MessageType }) => {
    return (
      <MessageBubble
        message={item.text}
        timestamp={item.createdAt}
        isMine={item.isMine}
        senderName={!item.isMine ? name : undefined}
        textSize={textSize}
        showNameAndPhoto={showNameAndPhoto}
        useShortNames={useShortNames}
      />
    );
  };

  if (loading) return <LoadingSpinner message="Carregando mensagens..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundChat }]} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.flex}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={[styles.flex, { paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0 }]}>
          <View style={[styles.chatWallpaper, { backgroundColor: chatWallpaper || colors.backgroundChat }]} />

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={[
              styles.messagesList, 
              { paddingBottom: spacing.md + (Platform.OS === 'ios' ? 0 : insets.bottom) }
            ]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.datePill}>
                  <Text style={[styles.datePillText, { color: '#FFF' }]}>Diga "Olá" para {name}!</Text>
                </View>
              </View>
            }
          />

          <MessageInput onSend={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  list: { flex: 1 },
  chatWallpaper: { ...StyleSheet.absoluteFillObject },
  headerTitleWrap: { flexDirection: 'row', alignItems: 'center', width: 200 },
  headerTextWrap: { marginLeft: 10, flex: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 8 },
  headerIconButton: { padding: 4 },
  headerName: { fontSize: 17, fontWeight: '700' },
  headerStatus: { fontSize: 13, marginTop: 1 },
  messagesList: {
    paddingHorizontal: 8,
    paddingTop: spacing.sm,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  datePill: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
  datePillText: { fontSize: 14, fontWeight: '600' },
});
