import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityItem } from '@/components/feature/ActivityItem';
import { ChoreItem } from '@/components/feature/ChoreItem';
import { ChoreSlot } from '@/components/feature/ChoreSlot';
import { DayNavigator } from '@/components/feature/DayNavigator';
import { EmptyState } from '@/components/feature/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useActivities } from '@/hooks/useActivities';
import { useChoreSchedule } from '@/hooks/useChoreSchedule';
import { useChores } from '@/hooks/useChores';
import { useSchedule } from '@/hooks/useSchedule';
import { addDays, dayLabel, toDayKey } from '@/services/dateUtils';
import { buildDayPlan, DayEntry, LOCKED_NEEDS_CHORE } from '@/services/dayPlan';
import { useAlert } from '@/template/ui';

const MAX_PER_DAY = 5;

export default function HomeScreen() {
  const [selected, setSelected] = useState<Date>(new Date());
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { byId } = useActivities();
  const { items, forDay, toggle, postpone, remove } = useSchedule();
  const { byId: choreById } = useChores();
  const chores = useChoreSchedule();
  const { showAlert } = useAlert();

  const dayKey = toDayKey(selected);
  const todays = forDay(dayKey);
  const total = todays.length;
  const completed = todays.filter((t) => t.completed).length;
  const canAddMore = total < MAX_PER_DAY;
  const plan = buildDayPlan(todays, chores.forDay(dayKey));
  const addChore = () =>
    router.push({ pathname: '/pick-chore', params: { dayKey } });

  const onTogglePlay = (id: string, lockedLabel?: string) => {
    if (lockedLabel) {
      showAlert(
        'Legen er låst',
        lockedLabel === LOCKED_NEEDS_CHORE
          ? 'Tilføj en opgave og lav den, så låses legen op.'
          : 'Lav opgaven før legen, så låses den op.',
      );
      return;
    }
    toggle(id);
  };

  const onChoreLongPress = (id: string, title: string) => {
    showAlert(
      'Fjern opgave?',
      `Vil du fjerne "${title}" fra ${dayLabel(selected).toLowerCase()}?`,
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Fjern', style: 'destructive', onPress: () => chores.remove(id) },
      ],
    );
  };

  const renderEntry = (entry: DayEntry) => {
    if (entry.kind === 'chore-slot') return <ChoreSlot onPress={addChore} />;
    if (entry.kind === 'chore') {
      const chore = choreById(entry.item.choreId);
      if (!chore) return null;
      return (
        <ChoreItem
          item={entry.item}
          chore={chore}
          onToggle={() => chores.toggle(entry.item.id)}
          onLongPress={() => onChoreLongPress(entry.item.id, chore.title)}
        />
      );
    }
    const activity = byId(entry.item.activityId);
    if (!activity) return null;
    return (
      <ActivityItem
        item={entry.item}
        activity={activity}
        lockedLabel={entry.lockedLabel}
        onToggle={() => onTogglePlay(entry.item.id, entry.lockedLabel)}
        onPostpone={() => onPostpone(entry.item.id)}
        onLongPress={() => onLongPress(entry.item.id, activity.title)}
      />
    );
  };

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
        data={plan}
        keyExtractor={(entry) =>
          entry.kind === 'chore-slot' ? 'chore-slot' : entry.item.id
        }
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
        renderItem={({ item }) => renderEntry(item)}
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
          label={canAddMore ? 'Tilføj leg' : 'Fuld (5/5)'}
          icon="add-circle"
          onPress={() =>
            router.push({ pathname: '/pick-activity', params: { dayKey } })
          }
          disabled={!canAddMore}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          label="Tilføj opgave"
          icon="checkbox"
          variant="secondary"
          onPress={addChore}
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
    gap: spacing.sm,
    ...shadows.md,
  },
});
