import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { useActivities } from '@/hooks/useActivities';
import { useAlert } from '@/template';

const EMOJIS = ['🧱', '🎨', '🎲', '⚽', '🧩', '🚴', '🎭', '🤸', '📚', '🧪', '🎹', '🎮', '🐾', '🌳', '🍳', '🪁', '🎯', '🦸'];
const COLORS = ['#FFD93D', '#4ECDC4', '#FF7A59', '#6BCB77', '#9B6DFF', '#FF6B9D', '#FFB84D', '#6DC5FF'];

export default function AddActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { create } = useActivities();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [oneNoteUrl, setOneNoteUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const save = async () => {
    if (!title.trim()) {
      showAlert('Mangler titel', 'Giv legen et navn, så vi kan finde den igen.');
      return;
    }
    await create({
      title: title.trim(),
      description: description.trim(),
      emoji,
      color,
      oneNoteUrl: oneNoteUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={typography.title}>Ny leg-aftale</Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSubtle, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Beskriv en sjov aktivitet, som I kan vælge imellem senere.
        </Text>

        <Text style={styles.label}>Titel</Text>
        <TextInput
          placeholder="fx Byg et LEGO-slot"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={styles.label}>Beskrivelse</Text>
        <TextInput
          placeholder="Hvad skal man gøre? Hvor foregår det?"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={styles.label}>Emoji</Text>
        <View style={styles.row}>
          {EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[styles.emojiBtn, emoji === e && styles.emojiBtnActive]}
            >
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Farve</Text>
        <View style={styles.row}>
          {COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorDot,
                {
                  backgroundColor: c,
                  borderColor: color === c ? colors.text : 'transparent',
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.label}>OneNote-link</Text>
        <TextInput
          placeholder="https://onedrive.live.com/..."
          value={oneNoteUrl}
          onChangeText={setOneNoteUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={styles.label}>Video-link</Text>
        <TextInput
          placeholder="https://youtube.com/..."
          value={videoUrl}
          onChangeText={setVideoUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={styles.label}>Billede-URL (valgfri)</Text>
        <TextInput
          placeholder="https://..."
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSubtle}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <PrimaryButton
          label="Gem leg-aftale"
          icon="save"
          onPress={save}
          style={{ flex: 1 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 3,
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
    ...shadows.md,
  },
});
