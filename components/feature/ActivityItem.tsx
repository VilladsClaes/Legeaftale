import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from '@/components/ui/Checkbox';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { Activity } from '@/services/activityService';
import { ScheduleItem } from '@/services/scheduleService';

interface Props {
  item: ScheduleItem;
  activity: Activity;
  onToggle: () => void;
  onPostpone: () => void;
  onLongPress?: () => void;
}

export function ActivityItem({
  item,
  activity,
  onToggle,
  onPostpone,
  onLongPress,
}: Props) {
  const router = useRouter();

  const openDetail = () => router.push(`/activity/${activity.id}`);

  return (
    <View style={styles.outer}>
      <Pressable
        onPress={openDetail}
        onLongPress={onLongPress}
        delayLongPress={400}
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
      >
        <View style={[styles.emojiBadge, { backgroundColor: activity.color }]}>
          <Text style={styles.emoji}>{activity.emoji}</Text>
        </View>
        <View style={styles.body}>
          <Text
            style={[styles.title, item.completed && styles.titleDone]}
            numberOfLines={1}
          >
            {activity.title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {activity.description || 'Tryk for detaljer, video eller OneNote-link.'}
          </Text>
          <Pressable
            onPress={onPostpone}
            style={({ pressed }) => [
              styles.postponeChip,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={10}
            accessibilityLabel="Udskyd leg til i morgen"
          >
            <Ionicons name="arrow-forward-circle" size={16} color={colors.secondary} />
            <Text style={styles.postponeText}>Udskyd til i morgen</Text>
          </Pressable>
        </View>
        <Checkbox
          checked={item.completed}
          onToggle={onToggle}
          color={activity.color}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  emojiBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 30 },
  body: { flex: 1 },
  title: { ...typography.heading, color: colors.textStrong },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  desc: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    marginTop: 2,
  },
  postponeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  postponeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
});
