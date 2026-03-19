import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToastProps } from 'react-native-toast-message';

interface MessageToastProps extends BaseToastProps {
  props?: {
    avatar?: string | null;
    senderName?: string;
    onPress?: () => void;
  };
}

export default function MessageToast({ 
  text1, 
  text2, 
  props 
}: MessageToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    if (props?.onPress) {
      props.onPress();
    }
    Toast.hide();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity 
        style={styles.content} 
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <View style={styles.imageContainer}>
          {props?.avatar ? (
            <Image source={{ uri: props.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {props?.senderName || text1}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {text2}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: '5%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  placeholderAvatar: {
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});
