import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useChores } from '@/hooks/useChores';
import { useChoreSchedule } from '@/hooks/useChoreSchedule';
import { dayLabel, fromDayKey, toDayKey } from '@/services/dateUtils';
import { useAlert } from '@/template';

export default function PickChoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dayKey?: string }>();
  const dayKey = params.dayKey ?? toDayKey(new Date());
  const { chores } = useChores();
  const { forDay, add } = useChoreSchedule();
  const { showAlert } = useAlert();

  const day = fromDayKey(dayKey);
  const dayItems = forDay(dayKey);
  const alreadyIds = new Set(dayItems.map((s) => s.choreId));

  const onPick = async (id: string, title: string) => {
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
        data={chores}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 120 + insets.bottom,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.md }}>
            <Text style={typography.title}>Vælg en opgave</Text>
            <Text
              style={[
                typography.body,
                { color: colors.textSubtle, marginTop: 4 },
              ]}
            >
              Tilføj en huslig opgave til {dayLabel(day).toLowerCase()}. Opgaver
              skal klares mellem leg-aftalerne.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list" size={44} color={colors.secondary} />
            <Text style={styles.emptyTitle}>Ingen opgaver i biblioteket</Text>
            <Text style={styles.emptyDesc}>
              Tryk nedenfor for at oprette den første.
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
                  color={colors.secondary}
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
          label="Opret ny opgave"
          icon="create"
          variant="ghost"
          onPress={() => router.push('/add-chore')}
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
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptyTitle: { ...typography.heading, color: colors.textStrong, marginTop: 8 },
  emptyDesc: { ...typography.bodySmall, color: colors.textSubtle, textAlign: 'center' },
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
