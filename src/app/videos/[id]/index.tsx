// import * as MediaLibrary from 'expo-media-library';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { useDeleteVideo, useVideoById } from '@/hooks/use-videos';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from 'tailwindcss/colors';

function DetailVideoPlayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.pause();
  });

  return (
    <VideoView
      player={player}
      className="aspect-video w-full rounded-2xl bg-black"
      contentFit="contain"
      nativeControls
      surfaceType="textureView"
    />
  );
}

function VideoDetailSkeleton() {
  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <View className="aspect-video w-full rounded-2xl bg-gray-200" />
      <View className="mt-6 w-full">
        <View className="mb-3 h-7 w-2/3 rounded bg-gray-200" />
        <View className="mb-2 h-4 w-full rounded bg-gray-200" />
        <View className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
        <View className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
      </View>
    </View>
  );
}

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);

  const { data: video, isPending, error } = useVideoById(videoId);
  const deleteVideo = useDeleteVideo();

  const handleDelete = () => {
    Alert.alert('Delete video?', 'This video will be permanently removed.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteVideo.mutate(videoId, {
            onSuccess: () => {
              router.back();
            },
            onError: () => {
              Alert.alert('Delete failed', 'Something went wrong. Please try again.');
            },
          });
        },
      },
    ]);
  };

  // Disabled in Expo Go. Real implementation works in development build.
  /* const saveVideoToGallery = async (uri: string) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to save the video to your library.');
      return;
    }
    await MediaLibrary.saveToLibraryAsync(uri);

    Alert.alert('Saved', 'Video saved to your library.');
  }; */

  const shareVideo = async (uri: string) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Sharing unavailable', 'Sharing is not available on this device.');
      return;
    }

    await Sharing.shareAsync(uri);
  };

  if (isPending) {
    return <VideoDetailSkeleton />;
  }

  if (error || !video) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <MaterialIcons name="error-outline" size={32} color="#ef4444" />
        </View>
        <AppText type="title" className="mb-2 text-center">
          Video not found
        </AppText>
        <AppText className="mb-6 max-w-[280px] text-center text-gray-500">
          We couldn’t load this video. It may have been deleted or moved.
        </AppText>
        <Button title="Go back" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: video.name,
          headerRight: () => (
            <Menu>
              <MenuTrigger disabled={deleteVideo.isPending}>
                <View className="h-10 w-10 items-center justify-center rounded-full">
                  <MaterialIcons name="more-vert" size={24} color="black" />
                </View>
              </MenuTrigger>

              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    width: 140,
                    borderRadius: 12,
                    paddingVertical: 6,
                  },
                }}>
                <MenuOption onSelect={() => router.push(`/videos/${id}/edit`)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <MaterialIcons name="edit" size={20} color="black" />
                    <AppText>Edit</AppText>
                  </View>
                </MenuOption>
                {/*  <MenuOption onSelect={() => saveVideoToGallery(video.uri)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <MaterialIcons name="file-download" size={20} color="black" />
                    <AppText>Save</AppText>
                  </View>
                </MenuOption> */}
                <MenuOption onSelect={() => shareVideo(video.uri)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <MaterialIcons name="share" size={20} color="black" />
                    <AppText>Share</AppText>
                  </View>
                </MenuOption>
                <MenuOption onSelect={handleDelete}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <MaterialIcons name="delete-outline" size={20} color={colors.red[500]} />
                    <AppText className="text-red-500">Delete</AppText>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pt-6 pb-safe">
        <DetailVideoPlayer uri={video.uri} />

        <View className="mt-6 w-full">
          <AppText type="title" className="mb-2">
            {video.name}
          </AppText>

          {video.description ? (
            <AppText className="leading-6 text-gray-500">{video.description}</AppText>
          ) : (
            <AppText className="text-gray-400">No description</AppText>
          )}

          <AppText className="mt-4 text-xs text-gray-400">Created at: {video.created_at}</AppText>
        </View>
      </ScrollView>
      {deleteVideo.isPending && (
        <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/40">
          <View className="items-center rounded-2xl bg-white px-6 py-5">
            <ActivityIndicator />
            <AppText className="mt-3 text-gray-600">Deleting video...</AppText>
          </View>
        </View>
      )}
    </>
  );
}
