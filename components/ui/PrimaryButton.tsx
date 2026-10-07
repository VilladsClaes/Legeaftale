import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  style,
}: Props) {
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  const fg = variant === 'ghost' ? colors.primary : colors.textOnPrimary;
  const border = variant === 'ghost' ? colors.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: disabled ? 0.4 : 1,
        },
        variant !== 'ghost' && shadows.sm,
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={20} color={fg} style={{ marginRight: spacing.sm }} />
      ) : null}
      <Text style={[typography.button, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
