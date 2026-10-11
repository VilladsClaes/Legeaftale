import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface Props {
  onPress: () => void;
}

/** Placeholder between two plays where a chore must be added to unlock the next play. */
export function ChoreSlot({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.slot, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name="add-circle-outline" size={22} color={colors.secondary} />
      <Text style={styles.text}>Tilføj en opgave for at låse næste leg op</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.secondary,
    backgroundColor: colors.secondarySoft,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textStrong,
    fontWeight: '700',
  },
});
