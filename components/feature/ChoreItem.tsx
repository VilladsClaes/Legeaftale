import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from '@/components/ui/Checkbox';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { Chore } from '@/services/choreService';
import { ChoreScheduleItem } from '@/services/choreScheduleService';

interface Props {
  item: ChoreScheduleItem;
  chore: Chore;
  onToggle: () => void;
  onLongPress?: () => void;
}

export function ChoreItem({ item, chore, onToggle, onLongPress }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.92 : 1 }]}
    >
      <View style={[styles.emoji, { backgroundColor: chore.color }]}>
        <Text style={styles.emojiText}>{chore.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.title, item.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {chore.title}
        </Text>
        {chore.description ? (
          <Text
            style={[styles.desc, item.completed && styles.descDone]}
            numberOfLines={1}
          >
            {chore.description}
          </Text>
        ) : null}
      </View>
      <Checkbox checked={item.completed} onToggle={onToggle} color={chore.color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  emoji: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 22 },
  title: {
    ...typography.body,
    color: colors.textStrong,
    fontWeight: '700',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  desc: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    marginTop: 2,
  },
  descDone: {
    textDecorationLine: 'line-through',
  },
});
