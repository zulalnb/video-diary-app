import { Link } from 'expo-router';
import { FlatList, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';
import { useVideos } from '@/hooks/use-videos';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HomeScreen() {
  const { data: videos, isPending, isRefetching, error, refetch } = useVideos();

  if (isPending) {
    return (
      <View className="pb-safe flex-1 px-5 pt-[calc(env(safe-area-inset-top)+5)]">
        <AppText type="title" className="mb-4">
          Videos
        </AppText>
        <View className="gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <MaterialIcons name="error-outline" size={32} color="#6b7280" />
        </View>
        <AppText type="title" className="mb-2 text-center">
          Something went wrong
        </AppText>
        <AppText className="mb-6 max-w-[280px] text-center text-gray-500">
          We couldn’t load your videos. Please try again.
        </AppText>
        <Button title="Try again" onPress={() => refetch()} />
      </View>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <MaterialIcons name="videocam-off" size={32} color="#6b7280" />
        </View>
        <AppText type="title" className="mb-2 text-center">
          No videos yet
        </AppText>
        <AppText className="mb-6 max-w-[280px] text-center text-gray-500">
          Add your first video to start creating memories.
        </AppText>
        <Link href="/modal" asChild>
          <Button title="Add Video" />
        </Link>
      </View>
    );
  }

  return (
    <View className="pb-safe flex-1 px-5 pt-[calc(env(safe-area-inset-top)+5)]">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <AppText type="title" className="mb-4">
            Videos
          </AppText>
        }
        contentContainerClassName="gap-6"
        renderItem={({ item }) => (
          <VideoCard id={item.id} thumbnail={item.thumbnail} name={item.name} />
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      {/* Floating button */}
      <Link href="/modal" asChild>
        <Fab />
      </Link>
    </View>
  );
}
