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
import { useChores } from '@/hooks/useChores';
import { useAlert } from '@/template/ui';

const EMOJIS = [
  '🧹', '🍎', '💧', '🧼', '🛋️', '🧺', '🪥', '🧦',
  '🍌', '🥕', '📚', '🪴', '🧸', '🚿', '🪣', '🧽',
];
const COLORS = [
  '#4ECDC4', '#6BCB77', '#6DC5FF', '#9B6DFF',
  '#FFD93D', '#FF7A59', '#FFB84D', '#FF6B9D',
];

export default function AddChoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { create } = useChores();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const save = async () => {
    if (!title.trim()) {
      showAlert('Mangler titel', 'Giv opgaven et navn, så den er let at genkende.');
      return;
    }
    await create({
      title: title.trim(),
      description: description.trim(),
      emoji,
      color,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 140 + insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={typography.title}>Ny huslig opgave</Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSubtle, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Opgaver skal klares mellem leg-aftalerne. Fx oprydning, snack eller vand.
        </Text>

        <Text style={styles.label}>Titel</Text>
        <TextInput
          placeholder="fx Ryd op fra tidligere leg"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={styles.label}>Beskrivelse (valgfri)</Text>
        <TextInput
          placeholder="Kort forklaring til dit barn."
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={3}
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
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <PrimaryButton
          label="Gem opgave"
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
    borderColor: colors.secondary,
    backgroundColor: colors.secondarySoft,
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
