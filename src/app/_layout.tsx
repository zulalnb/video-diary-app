import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-reanimated';

import DatabaseProvider from '@/providers/database-provider';
import QueryProvider from '@/providers/query-provider';

import { Toast } from '@/components/ui/toast';
import '@/global.css';
import '@/lib/nativewind';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <MenuProvider>
          <DatabaseProvider>
            <QueryProvider>
              <Stack
                screenOptions={{
                  headerBackButtonDisplayMode: 'minimal',
                }}>
                <Stack.Screen name="index" options={{ headerTitle: 'My Moments' }} />
                <Stack.Screen
                  name="videos/[id]/index"
                  options={{
                    headerTitle: 'Video Detail',
                  }}
                />
                <Stack.Screen
                  name="videos/[id]/edit"
                  options={{
                    headerTitle: 'Edit Video Detail',
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    headerTitle: 'Create Video',
                    headerTitleStyle: {
                      fontSize: 24,
                      fontWeight: 'bold',
                    },
                  }}
                />
              </Stack>
              <Toast />
              <StatusBar style="dark" />
            </QueryProvider>
          </DatabaseProvider>
        </MenuProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
