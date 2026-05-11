import { View } from 'react-native';
import RNToast, { type ToastConfigParams } from 'react-native-toast-message';
import colors from 'tailwindcss/colors';

import { AppText } from '@/components/app-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export const toastConfig = {
  success: ({ text1 }: ToastConfigParams<any>) => (
    <View className="mx-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
      <View className="flex-row items-center gap-2">
        <IconSymbol name="checkmark.circle" size={18} color={colors.green[600]} />
        <AppText className="text-sm text-green-700">{text1}</AppText>
      </View>
    </View>
  ),
  error: ({ text1 }: ToastConfigParams<any>) => (
    <View className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
      <View className="flex-row items-center gap-2">
        <IconSymbol name="exclamationmark.circle" size={18} color={colors.red[600]} />
        <AppText className="text-sm text-red-600">{text1}</AppText>
      </View>
    </View>
  ),
};

export function Toast() {
  return <RNToast config={toastConfig} position="bottom" bottomOffset={40} />;
}
