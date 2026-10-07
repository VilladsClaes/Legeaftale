import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useActivities } from '@/hooks/useActivities';
import { calendarService } from '@/services/calendarService';
import { useAlert } from '@/template';

export default function ActivityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { byId, remove } = useActivities();
  const { showAlert } = useAlert();

  const activity = id ? byId(id) : undefined;

  if (!activity) {
    return (
      <View style={styles.missing}>
        <Text style={typography.body}>Legen findes ikke længere.</Text>
      </View>
    );
  }

  const openLink = (url?: string, label?: string) => {
    if (!url) {
      showAlert(
        'Intet link',
        `Der er ikke tilføjet ${label ?? 'et link'} til denne leg endnu.`,
      );
      return;
    }
    Linking.openURL(url).catch(() => {
      showAlert('Kunne ikke åbne', 'Linket kan ikke åbnes på denne enhed.');
    });
  };

  const addToCalendar = async () => {
    const start = new Date();
    start.setHours(16, 0, 0, 0);
    const opened = await calendarService.addEvent({
      title: activity.title,
      notes: activity.description,
      url: activity.oneNoteUrl,
      date: start,
      durationMinutes: 60,
    });
    if (!opened) {
      showAlert(
        'Kunne ikke åbne kalender',
        'Kalenderen kunne ikke åbnes på denne enhed. Prøv igen senere.',
      );
    }
  };

  const onDelete = () => {
    showAlert('Slet leg?', `"${activity.title}" fjernes fra biblioteket.`, [
      { text: 'Annuller', style: 'cancel' },
      {
        text: 'Slet',
        style: 'destructive',
        onPress: async () => {
          await remove(activity.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 180 + insets.bottom,
        }}
      >
        <View style={[styles.heroCard, { backgroundColor: activity.color }]}>
          {activity.imageUrl ? (
            <Image
              source={{ uri: activity.imageUrl }}
              style={styles.heroImg}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.heroEmoji}>{activity.emoji}</Text>
          )}
        </View>

        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.desc}>
          {activity.description || 'Ingen beskrivelse tilføjet endnu.'}
        </Text>

        <View style={styles.linksRow}>
          <LinkTile
            icon="book"
            label="OneNote"
            available={!!activity.oneNoteUrl}
            onPress={() => openLink(activity.oneNoteUrl, 'et OneNote-link')}
          />
          <LinkTile
            icon="play-circle"
            label="Video"
            available={!!activity.videoUrl}
            onPress={() => openLink(activity.videoUrl, 'et video-link')}
          />
          <LinkTile
            icon="calendar"
            label="Kalender"
            available
            onPress={addToCalendar}
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Hold inde på en leg i dagsvisningen for at fjerne den fra dagen. Du kan
            også swipe til højre for at udskyde.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <PrimaryButton
          label="Slet leg fra bibliotek"
          icon="trash"
          variant="ghost"
          onPress={onDelete}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

function LinkTile({
  icon,
  label,
  available,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  available: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.linkTile,
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: available ? colors.surface : colors.surfaceMuted,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={28}
        color={available ? colors.primary : colors.textSubtle}
      />
      <Text
        style={[
          styles.linkLabel,
          { color: available ? colors.textStrong : colors.textSubtle },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    height: 200,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  heroImg: { width: '100%', height: '100%' },
  heroEmoji: { fontSize: 96 },
  title: { ...typography.display, color: colors.textStrong },
  desc: {
    ...typography.body,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
  linksRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  linkTile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  linkLabel: { ...typography.label },
  infoBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textStrong,
    flex: 1,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  footer: {
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
