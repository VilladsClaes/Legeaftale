import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props {
  checked: boolean;
  onToggle: () => void;
  color?: string;
}

export function Checkbox({ checked, onToggle, color = colors.primary }: Props) {
  return (
    <Pressable
      hitSlop={12}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => [
        styles.box,
        {
          borderColor: color,
          backgroundColor: checked ? color : 'transparent',
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {checked ? <Ionicons name="checkmark" size={22} color="#fff" /> : <View />}
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
