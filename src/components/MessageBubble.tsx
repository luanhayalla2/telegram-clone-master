import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import useTheme from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MessageBubbleProps {
  message: string;
  timestamp: number;
  isMine: boolean;
  senderName?: string;
  avatar?: string | null;
  textSize?: number;
  showNameAndPhoto?: boolean;
  useShortNames?: boolean;
  imageUrl?: string;
}

export default function MessageBubble({ 
  message, 
  timestamp, 
  isMine, 
  senderName,
  avatar,
  textSize = 16,
  showNameAndPhoto = true,
  useShortNames = false,
  imageUrl
}: MessageBubbleProps) {
  const { colors } = useTheme();

  const timeString = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <View style={[
      styles.container,
      isMine ? styles.myMessageContainer : styles.theirMessageContainer
    ]}>
      {!isMine && showNameAndPhoto && (
        <View style={styles.content}>
          <Text style={[styles.senderName, { color: colors.primary }]}>
            {useShortNames ? (senderName || 'Usuário').split(' ')[0] : (senderName || 'Usuário')}
          </Text>
          <View style={[styles.bubble, { backgroundColor: colors.bubbleTheirs }]}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.imageAttachment} resizeMode="cover" />
            ) : null}
            {(!imageUrl || message !== '[Imagem]') && (
              <Text style={[styles.messageText, { color: colors.textPrimary, fontSize: textSize }]}>
                {message}
              </Text>
            )}
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {timeString}
            </Text>
          </View>
        </View>
      )}

      {isMine && (
        <View style={[styles.bubble, styles.myBubble, { backgroundColor: colors.bubbleMine }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imageAttachment} resizeMode="cover" />
          ) : null}
          {(!imageUrl || message !== '[Imagem]') && (
            <Text style={[styles.messageText, { color: colors.textPrimary, fontSize: textSize }]}>
              {message}
            </Text>
          )}
          <View style={styles.myMessageFooter}>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {timeString}
            </Text>
            <MaterialCommunityIcons name="check-all" size={14} color={colors.textSecondary} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  content: {
    flexDirection: 'column',
    maxWidth: '80%',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: 12,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: '100%',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  myBubble: {
    maxWidth: '80%',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  myMessageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  imageAttachment: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
});
