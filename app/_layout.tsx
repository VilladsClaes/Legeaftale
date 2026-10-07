import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { colors } from '@/constants/theme';
import { AlertProvider } from '@/template';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <ActivityProvider>
          <ScheduleProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="add-activity"
                options={{ title: 'Ny leg-aftale', presentation: 'modal' }}
              />
              <Stack.Screen
                name="pick-activity"
                options={{ title: 'Vælg leg', presentation: 'modal' }}
              />
              <Stack.Screen
                name="activity/[id]"
                options={{ title: 'Leg-aftale' }}
              />
            </Stack>
          </ScheduleProvider>
        </ActivityProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
