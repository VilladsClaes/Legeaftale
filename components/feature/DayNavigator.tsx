import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import {
  addDays,
  dayLabel,
  formatShortDay,
  isSameDay,
  isToday,
  toDayKey,
} from '@/services/dateUtils';

interface Props {
  selected: Date;
  onChange: (d: Date) => void;
  countsByDay?: Record<string, { total: number; completed: number }>;
}

export function DayNavigator({ selected, onChange, countsByDay = {} }: Props) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i - 3));
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => onChange(addDays(selected, -1))}
          style={({ pressed }) => [styles.arrow, { opacity: pressed ? 0.6 : 1 }]}
          hitSlop={10}
          accessibilityLabel="Forrige dag"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>{dayLabel(selected)}</Text>
          {!isToday(selected) ? (
            <Pressable onPress={() => onChange(new Date())} hitSlop={8}>
              <Text style={styles.todayLink}>Gå til i dag</Text>
            </Pressable>
          ) : (
            <Text style={styles.subtle}>Jeres leg-aftaler</Text>
          )}
        </View>
        <Pressable
          onPress={() => onChange(addDays(selected, 1))}
          style={({ pressed }) => [styles.arrow, { opacity: pressed ? 0.6 : 1 }]}
          hitSlop={10}
          accessibilityLabel="Næste dag"
        >
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {days.map((d) => {
          const key = toDayKey(d);
          const active = isSameDay(d, selected);
          const stats = countsByDay[key];
          return (
            <Pressable
              key={key}
              onPress={() => onChange(d)}
              style={({ pressed }) => [
                styles.pill,
                active && styles.pillActive,
                isToday(d) && !active && styles.pillToday,
                { transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
            >
              <Text style={[styles.pillDow, active && styles.pillDowActive]}>
                {formatShortDay(d)}
              </Text>
              <Text style={[styles.pillDay, active && styles.pillDayActive]}>
                {d.getDate()}
              </Text>
              {stats && stats.total > 0 ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: active ? '#fff' : colors.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.dotText,
                      { color: active ? colors.primary : colors.primaryDark },
                    ]}
                  >
                    {stats.completed}/{stats.total}
                  </Text>
                </View>
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  label: { ...typography.title, color: colors.text },
  subtle: { ...typography.bodySmall, color: colors.textSubtle, marginTop: 2 },
  todayLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  strip: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  pill: {
    width: 60,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillToday: { borderColor: colors.primary },
  pillDow: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'uppercase',
  },
  pillDowActive: { color: '#FFE4DB' },
  pillDay: { ...typography.title, color: colors.text, marginTop: 2 },
  pillDayActive: { color: '#fff' },
  dot: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    minWidth: 32,
    alignItems: 'center',
  },
  dotText: { fontSize: 10, fontWeight: '800' },
  dotPlaceholder: { height: 18, marginTop: 6 },
});
