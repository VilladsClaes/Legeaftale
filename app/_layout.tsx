import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { ChoreProvider } from '@/contexts/ChoreContext';
import { ChoreScheduleProvider } from '@/contexts/ChoreScheduleContext';
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { colors } from '@/constants/theme';
import { AlertProvider } from '@/template/ui';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <ActivityProvider>
          <ScheduleProvider>
            <ChoreProvider>
              <ChoreScheduleProvider>
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
                    name="pick-chore"
                    options={{ title: 'Vælg opgave', presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="add-chore"
                    options={{ title: 'Ny opgave', presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="activity/[id]"
                    options={{ title: 'Leg-aftale' }}
                  />
                </Stack>
              </ChoreScheduleProvider>
            </ChoreProvider>
          </ScheduleProvider>
        </ActivityProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
