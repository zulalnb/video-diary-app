import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';
import { useDeleteVideos, useVideos } from '@/hooks/use-videos';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from 'tailwindcss/colors';

export default function HomeScreen() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { data: videos, isPending, isRefetching, error, refetch } = useVideos();
  const deleteVideos = useDeleteVideos();

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    Alert.alert('Delete videos?', 'These videos will be permanently removed.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteVideos.mutate(selectedIds, {
            onSuccess: () => {
              refetch();
              setSelectionMode(false);
              setSelectedIds([]);
            },
            onError: () => {
              Alert.alert('Delete failed', 'Something went wrong. Please try again.');
            },
          });
        },
      },
    ]);
  };

  if (isPending) {
    return (
      <View className="pb-safe flex-1 gap-6 px-5 pt-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
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
      <View className="pb-safe flex-1 items-center px-6 pt-40">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <MaterialIcons name="videocam-off" size={48} color="#6b7280" />
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

  const allSelected = videos.length > 0 && selectedIds.length === videos.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectionMode(true);
    setSelectedIds(videos.map((video) => video.id));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: selectionMode ? `${selectedIds.length} Selected` : 'My Moments',
          headerLeft: () =>
            selectionMode ? (
              <Button
                title={allSelected ? 'Unselect All' : 'Select All'}
                variant="ghost"
                onPress={handleToggleSelectAll}
                icon={<MaterialIcons name="check-circle-outline" size={18} color="#6366f1" />}
              />
            ) : null,
          headerRight: () =>
            selectionMode ? (
              <View className="flex-row justify-center gap-0.5">
                <Button
                  variant="ghost"
                  onPress={handleDelete}
                  icon={<MaterialIcons name="delete-outline" size={20} color={colors.red[500]} />}
                />
                <Button
                  title="Cancel"
                  variant="ghost"
                  textClassName="text-gray-800"
                  onPress={() => {
                    setSelectionMode(false);
                    setSelectedIds([]);
                  }}
                />
              </View>
            ) : null,
        }}
      />
      <View className="pb-safe flex-1 px-5 pt-5">
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="gap-6"
          renderItem={({ item }) => (
            <VideoCard
              id={item.id}
              thumbnail={item.thumbnail}
              name={item.name}
              createdAt={item.created_at}
              selected={selectedIds.includes(item.id)}
              selectionMode={selectionMode}
              onLongPress={() => {
                setSelectionMode(true);
                setSelectedIds([item.id]);
              }}
              onPress={() => {
                if (selectionMode) toggleSelect(item.id);
                else router.push(`/videos/${item.id}`);
              }}
            />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
        />

        {/* Floating button */}
        {!selectionMode && (
          <Link href="/modal" asChild>
            <Fab />
          </Link>
        )}
      </View>
    </>
  );
}
