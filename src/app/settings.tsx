import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { useSettingsStore } from '@/stores/settings-store';
import colors from 'tailwindcss/colors';

export default function SettingsScreen() {
  const { hapticsEnabled, toggleHaptics } = useSettingsStore();

  const handleToggleHaptics = async () => {
    if (!hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    toggleHaptics();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <AppView className="flex-1 px-5 pt-6">
        <AppText className="mb-3 font-semibold text-gray-500">Feedback</AppText>
        <View className="rounded-2xl bg-gray-100">
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 pr-4">
              <AppText className="font-semibold">Haptics</AppText>
              <AppText className="mt-1 text-sm text-gray-500">
                Enable vibration feedback for actions like long press and delete.
              </AppText>
            </View>
            <Switch
              ios_backgroundColor={colors.gray[400]}
              trackColor={{
                false: colors.black,
                true: colors.indigo[500],
              }}
              thumbColor="#ffffff"
              value={hapticsEnabled}
              onValueChange={handleToggleHaptics}
            />
          </View>
        </View>
      </AppView>
    </>
  );
}
