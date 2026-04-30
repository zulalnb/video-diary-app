import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import DatabaseProvider from '@/providers/database-provider';
import QueryProvider from '@/providers/query-provider';

import '@/global.css';
import '@/lib/nativewind';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <DatabaseProvider>
        <QueryProvider>
          <Stack
            screenOptions={{
              headerBackButtonDisplayMode: 'minimal',
            }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="videos/[id]" options={{ headerTitle: 'Loading...' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </QueryProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
