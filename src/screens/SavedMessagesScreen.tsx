import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import useAuth from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedMessages'>;

export default function SavedMessagesScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { textSize, chatWallpaper } = useSettings();
  const { uid: myUid } = useAuth();

  const flatListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mensagens Salvas',
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.textPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, colors]);

  const loadMessages = useCallback(async () => {
    if (!myUid) return;
    setLoading(true);
    try {
      const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(myUid.toLowerCase())
        .setLimit(50)
        .build();
      
      const fetched = await messagesRequest.fetchPrevious();
      setMessages(fetched);
    } catch (error) {
      console.error('Erro ao carregar mensagens salvas:', error);
    } finally {
      setLoading(false);
    }
  }, [myUid]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async (text: string) => {
    if (!myUid) return;
    try {
      const textMessage = new CometChat.TextMessage(
        myUid.toLowerCase(),
        text,
        CometChat.RECEIVER_TYPE.USER
      );
      
      const sentMessage: any = await CometChat.sendMessage(textMessage);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível salvar a mensagem.');
    }
  };

  if (loading) return <LoadingSpinner message="Abrindo nuvem..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundChat }]} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.flex}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={styles.flex}>
          <View style={[styles.chatWallpaper, { backgroundColor: chatWallpaper || colors.backgroundChat }]} />

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble
                message={item.text || item.data?.text || ''}
                timestamp={item.sentAt}
                isMine={true}
                textSize={textSize}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="bookmark" size={80} color={colors.primary} style={{ opacity: 0.5 }} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Encaminhe mensagens de outros chats aqui para mantê-las salvas.
                </Text>
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
  messagesList: { paddingHorizontal: 8, paddingTop: 16, flexGrow: 1, justifyContent: 'flex-end' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 100 },
  emptyText: { textAlign: 'center', marginTop: 16, fontSize: 15, lineHeight: 22 },
});
