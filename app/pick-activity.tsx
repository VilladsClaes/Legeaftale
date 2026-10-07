import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useActivities } from '@/hooks/useActivities';
import { useSchedule } from '@/hooks/useSchedule';
import { dayLabel, fromDayKey, toDayKey } from '@/services/dateUtils';
import { useAlert } from '@/template';

const MAX_PER_DAY = 5;

export default function PickActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dayKey?: string }>();
  const dayKey = params.dayKey ?? toDayKey(new Date());
  const { activities } = useActivities();
  const { forDay, add } = useSchedule();
  const { showAlert } = useAlert();

  const day = fromDayKey(dayKey);
  const dayItems = forDay(dayKey);
  const alreadyIds = new Set(dayItems.map((s) => s.activityId));
  const canAdd = dayItems.length < MAX_PER_DAY;

  const onPick = async (id: string, title: string) => {
    if (!canAdd) {
      showAlert('Dagen er fuld', 'Du kan højst have 5 leg-aftaler på én dag.');
      return;
    }
    if (alreadyIds.has(id)) {
      showAlert('Allerede valgt', `"${title}" er allerede på denne dag.`);
      return;
    }
    await add(dayKey, id);
    router.back();
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={activities}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 120 + insets.bottom,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.md }}>
            <Text style={typography.title}>Vælg en leg</Text>
            <Text
              style={[
                typography.body,
                { color: colors.textSubtle, marginTop: 4 },
              ]}
            >
              Tilføj til {dayLabel(day).toLowerCase()}.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const already = alreadyIds.has(item.id);
          return (
            <Pressable
              onPress={() => onPick(item.id, item.title)}
              style={({ pressed }) => [
                styles.card,
                { opacity: pressed || already ? 0.6 : 1 },
              ]}
            >
              <View style={[styles.emoji, { backgroundColor: item.color }]}>
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.desc} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
              {already ? (
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color={colors.success}
                />
              ) : (
                <Ionicons
                  name="add-circle"
                  size={30}
                  color={colors.primary}
                />
              )}
            </Pressable>
          );
        }}
      />
      <View
        style={[
          styles.bottom,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <PrimaryButton
          label="Opret ny leg"
          icon="create"
          variant="ghost"
          onPress={() => router.push('/add-activity')}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  emoji: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.heading, color: colors.textStrong },
  desc: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    marginTop: 2,
  },
  bottom: {
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
  },
});
