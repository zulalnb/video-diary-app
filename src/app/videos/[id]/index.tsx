import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoDetailSkeleton } from '@/components/video-detail-skeleton';
import { VideoPlayer } from '@/components/video-player';
import { useDeleteVideo, useVideoById } from '@/hooks/use-videos';
import { useSettingsStore } from '@/stores/settings-store';
import colors from 'tailwindcss/colors';

export default function VideoDetailScreen() {
  const [visibleModal, setVisibleModal] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);

  const { data: video, isPending, error } = useVideoById(videoId);
  const deleteVideo = useDeleteVideo();
  const { hapticsEnabled } = useSettingsStore();

  const handleDelete = () => {
    setVisibleModal(false);
    deleteVideo.mutate(videoId, {
      onSuccess: () => {
        if (hapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.back();
      },
      onError: () => {
        Alert.alert('Delete failed', 'Something went wrong. Please try again.');
      },
    });
  };

  // Disabled in Expo Go. Real implementation works in development build.
  const saveVideoToGallery = async (uri: string) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to save the video to your library.');
      return;
    }
    await MediaLibrary.saveToLibraryAsync(uri);

    Alert.alert('Saved', 'Video saved to your library.');
  };

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
      <AppView className="flex-1 items-center justify-center px-6">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <IconSymbol name="exclamationmark.circle" size={32} color={colors.red[500]} />
        </View>
        <AppText center type="title" className="mb-2">
          Video not found
        </AppText>
        <AppText className="mb-6 max-w-[280px] text-gray-500">
          We couldn’t load this video. It may have been deleted or moved.
        </AppText>
        <Button title="Go back" variant="secondary" onPress={() => router.back()} />
      </AppView>
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
                  <IconSymbol name="ellipsis" size={24} color="black" />
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
                    <IconSymbol name="pencil" size={20} color="black" />
                    <AppText>Edit</AppText>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => saveVideoToGallery(video.uri)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <IconSymbol name="square.and.arrow.down" size={20} color="black" />
                    <AppText>Save</AppText>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => shareVideo(video.uri)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <IconSymbol name="square.and.arrow.up" size={20} color="black" />
                    <AppText>Share</AppText>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => setVisibleModal(true)}>
                  <View className="flex-row items-center gap-3 px-3 py-2">
                    <IconSymbol name="trash" size={20} color="#ef4444" />
                    <AppText className="text-red-500">Delete</AppText>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-safe"
        showsVerticalScrollIndicator={false}>
        <VideoPlayer uri={video.uri} className="rounded-none" />

        <View className="mt-6 px-5">
          {/* Date Badge */}
          <View className="mb-4 self-start rounded-2xl border border-amber-800/20 bg-amber-800/10 px-3 py-1">
            <AppText className="text-sm font-medium text-amber-900">
              {format(video.created_at, 'MMMM dd, yyyy')}
            </AppText>
          </View>
          <AppText type="title" className="mb-4">
            {video.name}
          </AppText>
          {video.description ? (
            <AppText className="text-lg leading-6 text-gray-500">{video.description}</AppText>
          ) : (
            <AppText className="text-gray-400">No description</AppText>
          )}
        </View>
      </ScrollView>
      <ConfirmModal
        visible={visibleModal}
        title="Delete Video?"
        description="The video will be permanently removed."
        loading={deleteVideo.isPending}
        onConfirm={handleDelete}
        confirmText="Delete"
        onCancel={() => setVisibleModal(false)}
      />
      {deleteVideo.isPending && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
          <View className="items-center rounded-2xl bg-white px-6 py-5">
            <ActivityIndicator />
            <AppText className="mt-3 text-gray-600">Deleting video...</AppText>
          </View>
        </View>
      )}
    </>
  );
}
