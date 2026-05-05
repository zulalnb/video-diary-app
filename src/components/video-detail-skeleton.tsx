import { View } from 'react-native';
import { AppView } from './app-view';

export function VideoDetailSkeleton() {
  return (
    <AppView className="pb-safe flex-1">
      <View className="aspect-video w-full bg-gray-200" />
      <View className="mt-6 w-full px-5">
        <View className="mb-3 h-7 w-2/3 rounded bg-gray-200" />
        <View className="mb-2 h-4 w-full rounded bg-gray-200" />
        <View className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
        <View className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
        <View className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
        <View className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
      </View>
    </AppView>
  );
}
