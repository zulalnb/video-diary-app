import * as Haptics from 'expo-haptics';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';
import { Video } from '@/db/schema';
import { useDeleteVideos, useVideos } from '@/hooks/use-videos';
import { useSettingsStore } from '@/stores/settings-store';

export default function HomeScreen() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: videos, isPending, isRefetching, error, refetch } = useVideos();
  const deleteVideos = useDeleteVideos();
  const { hapticsEnabled } = useSettingsStore();

  const hasVideos = !!videos && videos.length > 0;
  const allSelected = hasVideos && selectedIds.length === videos.length;

  const screenOptions = {
    headerTitle: selectionMode ? `${selectedIds.length} Selected` : 'My Moments',
    headerLeft: () =>
      selectionMode ? (
        <Button
          title="Cancel"
          variant="ghost"
          textClassName="text-gray-800"
          onPress={() => {
            setSelectionMode(false);
            setSelectedIds([]);
          }}
        />
      ) : null,
    headerRight: () =>
      selectionMode ? null : (
        <IconButton
          icon={<IconSymbol name="gearshape" color="black" size={24} />}
          onPress={() => router.push('/settings')}
        />
      ),
  };

  const triggerSelectionHaptic = async () => {
    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (!videos) return;

    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectionMode(true);
    setSelectedIds(videos.map((video) => video.id));
  };

  const handleBulkDelete = () => {
    setVisibleModal(false);

    deleteVideos.mutate(selectedIds, {
      onSuccess: () => {
        if (hapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        setSelectionMode(false);
        setSelectedIds([]);

        Toast.show({
          type: 'success',
          text1: selectedIds.length > 1 ? 'Videos deleted' : 'Video deleted',
          visibilityTime: 2000,
        });
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'Videos could not be deleted.',
          visibilityTime: 3500,
        });
      },
    });
  };

  const renderVideoCard = ({ item }: { item: Video }) => (
    <VideoCard
      name={item.name}
      thumbnail={item.thumbnail}
      createdAt={item.created_at}
      selected={selectedIds.includes(item.id)}
      selectionMode={selectionMode}
      onLongPress={() => {
        triggerSelectionHaptic();
        setSelectionMode(true);
        setSelectedIds([item.id]);
      }}
      onPress={() => {
        if (selectionMode) toggleSelect(item.id);
        else router.push(`/videos/${item.id}`);
      }}
    />
  );

  if (isPending) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <AppView className="pb-safe flex-1 gap-6 px-5 pt-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </AppView>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <AppView className="flex-1 items-center justify-center px-6">
          <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <IconSymbol name="exclamationmark.circle" size={32} color="#6b7280" />
          </View>

          <AppText center type="title" className="mb-2">
            Something went wrong
          </AppText>

          <AppText center className="mb-6 max-w-[280px] text-gray-500">
            We couldn’t load your videos. Please try again.
          </AppText>

          <Button title="Try again" onPress={() => refetch()} />
        </AppView>
      </>
    );
  }

  if (!hasVideos) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <AppView className="pb-safe flex-1 items-center px-6 pt-40">
          <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <IconSymbol name="video.slash" size={48} color="#6b7280" />
          </View>

          <AppText center type="title" className="mb-2">
            No videos yet
          </AppText>

          <AppText center className="mb-6 max-w-[280px] text-gray-500">
            Add your first video to start creating memories.
          </AppText>

          <Link href="/modal" asChild>
            <Button title="Add Video" />
          </Link>
        </AppView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={screenOptions} />

      <AppView className="flex-1 px-5 pt-5">
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="gap-6 pb-safe"
          showsVerticalScrollIndicator={false}
          renderItem={renderVideoCard}
          refreshing={isRefetching}
          onRefresh={refetch}
        />

        {!selectionMode && (
          <Link href="/modal" asChild>
            <Fab />
          </Link>
        )}

        <ConfirmModal
          visible={visibleModal}
          title="Delete videos?"
          description="Selected videos will be permanently removed."
          loading={deleteVideos.isPending}
          onConfirm={handleBulkDelete}
          confirmText="Delete"
          onCancel={() => setVisibleModal(false)}
        />

        {deleteVideos.isPending && (
          <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
            <View className="items-center rounded-2xl bg-white px-6 py-5">
              <ActivityIndicator />
              <AppText className="mt-3 text-gray-600">Deleting selected videos...</AppText>
            </View>
          </View>
        )}
      </AppView>

      {selectionMode && (
        <View className="pb-safe absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white px-5 pt-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                icon={<IconSymbol name="checkmark.circle" color="#1f2937" size={18} />}
                title={allSelected ? 'Unselect All' : 'Select All'}
                variant="secondary"
                onPress={handleToggleSelectAll}
              />
            </View>

            <View className="flex-1">
              <Button
                title={`Delete (${selectedIds.length})`}
                variant="destructive"
                onPress={() => setVisibleModal(true)}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
