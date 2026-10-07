import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityItem } from '@/components/feature/ActivityItem';
import { DayNavigator } from '@/components/feature/DayNavigator';
import { EmptyState } from '@/components/feature/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useActivities } from '@/hooks/useActivities';
import { useSchedule } from '@/hooks/useSchedule';
import { addDays, dayLabel, toDayKey } from '@/services/dateUtils';
import { useAlert } from '@/template';

const MAX_PER_DAY = 5;

export default function HomeScreen() {
  const [selected, setSelected] = useState<Date>(new Date());
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { byId } = useActivities();
  const { items, forDay, toggle, postpone, remove } = useSchedule();
  const { showAlert } = useAlert();

  const dayKey = toDayKey(selected);
  const todays = forDay(dayKey);
  const total = todays.length;
  const completed = todays.filter((t) => t.completed).length;
  const canAddMore = total < MAX_PER_DAY;

  const countsByDay = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    for (const i of items) {
      if (!map[i.dayKey]) map[i.dayKey] = { total: 0, completed: 0 };
      map[i.dayKey].total += 1;
      if (i.completed) map[i.dayKey].completed += 1;
    }
    return map;
  }, [items]);

  const onPostpone = (id: string) => {
    const nextDay = addDays(selected, 1);
    postpone(id, toDayKey(nextDay));
    showAlert(
      'Udskudt til næste dag',
      `Legen er flyttet til ${dayLabel(nextDay).toLowerCase()}.`,
    );
  };

  const onLongPress = (id: string, title: string) => {
    showAlert(
      'Fjern leg?',
      `Vil du fjerne "${title}" fra ${dayLabel(selected).toLowerCase()}?`,
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Fjern', style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  const hintText =
    total === 0
      ? 'Ingen leg-aftaler endnu. Tilføj din første leg til dagen!'
      : completed === total
        ? 'Fantastisk! Du har klaret alle leg-aftaler. 🎉'
        : `Du har ${total - completed} leg${total - completed === 1 ? '' : 'e'} tilbage.`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hiText}>Hej makker! 👋</Text>
            <Text style={styles.heroTitle}>Hvad skal vi lege?</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreNum}>
              {completed}/{total}
            </Text>
            <Text style={styles.scoreLabel}>klaret</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${total === 0 ? 0 : (completed / total) * 100}%`,
                backgroundColor:
                  completed === total && total > 0 ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.heroHint}>{hintText}</Text>
      </View>

      <DayNavigator
        selected={selected}
        onChange={setSelected}
        countsByDay={countsByDay}
      />

      <FlatList
        data={todays}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: 150 + insets.bottom,
        }}
        ListHeaderComponent={
          total > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>Dagens aftaler</Text>
              <View style={styles.pillHint}>
                <Text style={styles.pillHintText}>
                  {total}/{MAX_PER_DAY} valgt
                </Text>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const activity = byId(item.activityId);
          if (!activity) return null;
          return (
            <ActivityItem
              item={item}
              activity={activity}
              onToggle={() => toggle(item.id)}
              onPostpone={() => onPostpone(item.id)}
              onLongPress={() => onLongPress(item.id, activity.title)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Ingen leg-aftaler endnu"
            message={'Tryk på "Tilføj leg" nedenfor for at starte dagen.'}
            icon="color-palette-outline"
          />
        }
      />

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <PrimaryButton
          label={canAddMore ? 'Tilføj leg til dagen' : 'Dagen er fuld (5/5)'}
          icon="add-circle"
          onPress={() =>
            router.push({ pathname: '/pick-activity', params: { dayKey } })
          }
          disabled={!canAddMore}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  hiText: { ...typography.body, color: colors.textSubtle },
  heroTitle: {
    ...typography.display,
    color: colors.textStrong,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    minWidth: 72,
    ...shadows.sm,
  },
  scoreNum: { ...typography.title, color: colors.textStrong },
  scoreLabel: {
    ...typography.caption,
    color: colors.textStrong,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  progressTrack: {
    marginTop: spacing.md,
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.pill },
  heroHint: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listHeaderTitle: { ...typography.heading, color: colors.textStrong },
  pillHint: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pillHintText: {
    ...typography.caption,
    color: colors.textStrong,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    ...shadows.md,
  },
});
