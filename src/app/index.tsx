import { Link } from 'expo-router';
import { FlatList, Image, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { useVideos } from '@/hooks/use-videos';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { data: videos, isPending, error } = useVideos();
  const insets = useSafeAreaInsets();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Loading...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Something went wrong</AppText>
      </View>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <AppText type="title" className="mb-2 text-center">
          No videos yet
        </AppText>
        <AppText className="mb-4 text-center">
          Add your first video to start creating memories.
        </AppText>

        <Link href="/modal" asChild>
          <Button title="Add Video" />
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4" style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <AppText type="title" className="mb-4">
            Videos
          </AppText>
        }
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Link href={`/videos/${item.id}`} asChild>
            <Pressable className="overflow-hidden rounded-2xl bg-white shadow active:opacity-80">
              <Image source={{ uri: item.thumbnail }} className="h-48 w-full" resizeMode="cover" />

              <View className="p-3">
                <AppText className="text-base font-semibold">{item.name}</AppText>

                {item.description && (
                  <AppText className="text-sm text-gray-500" numberOfLines={2}>
                    {item.description}
                  </AppText>
                )}
              </View>
            </Pressable>
          </Link>
        )}
      />

      {/* Floating button */}
      <Link href="/modal" asChild>
        <Fab />
      </Link>
    </View>
  );
}
