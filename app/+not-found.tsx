import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ups!' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🙈</Text>
        <Text style={styles.title}>Siden findes ikke</Text>
        <Link href="/" style={styles.link}>
          Tilbage til dagens leg
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emoji: { fontSize: 64 },
  title: { ...typography.title, color: colors.textStrong, marginTop: spacing.md },
  link: { ...typography.label, color: colors.primary, marginTop: spacing.lg },
});
