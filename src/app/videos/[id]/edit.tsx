import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

import { AppText } from '@/components/app-text';
import { MetadataForm } from '@/components/metadata-form';
import { Button } from '@/components/ui/button';
import { useUpdateVideo, useVideoById } from '@/hooks/use-videos';
import { VideoMetadataFormValues, videoMetadataSchema } from '@/schemas/metadata';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePreventRemove } from '@react-navigation/native';

function DetailVideoPlayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.pause();
  });

  return (
    <VideoView
      player={player}
      className="mb-10 aspect-video w-full rounded-2xl bg-black"
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
  const updateVideo = useUpdateVideo();
  const navigation = useNavigation();

  const form = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    values: {
      name: video?.name || '',
      description: video?.description || '',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  usePreventRemove(form.formState.isDirty && !form.formState.isSubmitted, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'Your changes will be lost.',

      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  const handleSave = async (values: VideoMetadataFormValues) => {
    if (!video) return;
    updateVideo.mutate(
      { id: Number(id), video: values },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          Alert.alert('Update failed', 'Something went wrong. Please try again.');
        },
      }
    );
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
        }}
      />
      <FormProvider {...form}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          bottomOffset={100}
          className="flex-1 bg-white"
          contentContainerClassName="px-5 pt-6 pb-safe">
          <DetailVideoPlayer uri={video.uri} />
          <MetadataForm />
        </KeyboardAwareScrollView>
        <KeyboardStickyView offset={{ closed: 0, opened: 16 }}>
          <View className="pb-safe bg-white px-5 pt-3">
            <Button
              title="Update"
              loading={updateVideo.isPending}
              disabled={!form.formState.isDirty}
              onPress={form.handleSubmit(handleSave)}
              className="mt-4"
            />
          </View>
        </KeyboardStickyView>
      </FormProvider>
    </>
  );
}
