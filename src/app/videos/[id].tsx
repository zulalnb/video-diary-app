import { AppText } from '@/components/app-text';
import { useVideoById } from '@/hooks/use-videos';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ScrollView, Text, View } from 'react-native';

export default function VideoDetailScreen() {
  const params = useLocalSearchParams();
  const { data: video, isPending, error } = useVideoById(Number(params.id));

  const player = useVideoPlayer(video?.uri ?? null, (player) => {
    player.loop = true;
    player.pause();
  });

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !video) {
    return (
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ headerTitle: 'Error' }} />
        <Text>Something went wrong</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: video.name }} />
      <ScrollView className="flex-1 bg-white px-5 pt-6">
        <VideoView
          player={player}
          style={{ width: '100%', height: 260 }}
          contentFit="contain"
          nativeControls
        />

        <View className="mt-6">
          <AppText type="title" className="mb-2">
            {video.name}
          </AppText>

          {video.description ? (
            <AppText className="text-gray-500">{video.description}</AppText>
          ) : (
            <AppText className="text-gray-400">No description</AppText>
          )}

          <AppText className="mt-4 text-xs text-gray-400">Created at: {video.created_at}</AppText>
        </View>
      </ScrollView>
    </>
  );
}
