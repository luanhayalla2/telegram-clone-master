import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

interface SettingRowProps {
  iconName: string;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons';
  iconBgColor: string;
  label: string;
  subtitle?: string;
  rightBadge?: string;
  onPress: () => void;
  isLast?: boolean;
}

export default function SettingRow({
  iconName,
  iconType = 'Ionicons',
  iconBgColor,
  label,
  subtitle,
  rightBadge,
  onPress,
  isLast = false,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}> 
          {iconType === 'Ionicons' ? (
            <Ionicons name={iconName as any} size={18} color="#FFF" />
          ) : (
            <MaterialCommunityIcons name={iconName as any} size={18} color="#FFF" />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightBadge && <Text style={styles.badgeText}>{rightBadge}</Text>}
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />
      </View>
      {!isLast && <View style={[styles.divider, { backgroundColor: colors.separator }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  badgeText: {
    color: '#0A84FF',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64,
  },
});
