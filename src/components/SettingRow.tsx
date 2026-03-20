import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Platform, TextStyle } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

interface SettingRowProps {
  iconName: string;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons';
  iconBgColor: string;
  label: string;
  labelStyle?: TextStyle;
  subtitle?: string;
  rightBadge?: string;
  rightText?: string;
  onPress?: () => void;
  isLast?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function SettingRow({
  iconName,
  iconType = 'Ionicons',
  iconBgColor,
  label,
  labelStyle,
  subtitle,
  rightBadge,
  rightText,
  onPress,
  isLast = false,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface }]} 
      onPress={showSwitch ? undefined : onPress} 
      activeOpacity={showSwitch ? 1 : 0.7}
      disabled={showSwitch}
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
          <Text style={[styles.label, { color: colors.textPrimary }, labelStyle]}>{label}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.separator, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          />
        ) : (
          <View style={styles.rightContainer}>
            {rightText && <Text style={[styles.rightText, { color: colors.textSecondary }]}>{rightText}</Text>}
            {rightBadge && <Text style={[styles.badgeText, { color: colors.primary }]}>{rightBadge}</Text>}
            {!rightText && <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />}
          </View>
        )}
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 16,
    marginRight: 4,
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
