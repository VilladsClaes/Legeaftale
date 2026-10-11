import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props {
  checked: boolean;
  onToggle: () => void;
  color?: string;
  locked?: boolean;
}

export function Checkbox({
  checked,
  onToggle,
  color = colors.primary,
  locked = false,
}: Props) {
  const tint = locked ? colors.textSubtle : color;
  return (
    <Pressable
      hitSlop={12}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: locked }}
      style={({ pressed }) => [
        styles.box,
        {
          borderColor: tint,
          backgroundColor: checked ? tint : 'transparent',
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {checked ? (
        <Ionicons name="checkmark" size={22} color="#fff" />
      ) : locked ? (
        <Ionicons name="lock-closed" size={18} color={tint} />
      ) : (
        <View />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
