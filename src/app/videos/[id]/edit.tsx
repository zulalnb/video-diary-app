import { zodResolver } from '@hookform/resolvers/zod';
import { usePreventRemove } from '@react-navigation/native';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { MetadataForm } from '@/components/metadata-form';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoPlayer } from '@/components/video-player';
import { useUpdateVideo, useVideoById } from '@/hooks/use-videos';
import { VideoMetadataFormValues, videoMetadataSchema } from '@/schemas/metadata';

function VideoDetailSkeleton() {
  return (
    <AppView className="flex-1 px-5 pt-6">
      <View className="aspect-video w-full rounded-2xl bg-gray-200" />
      <View className="mt-6 w-full">
        <View className="mb-3 h-7 w-2/3 rounded bg-gray-200" />
        <View className="mb-2 h-4 w-full rounded bg-gray-200" />
        <View className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
        <View className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
      </View>
    </AppView>
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
    Keyboard.dismiss();
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
    Keyboard.dismiss();
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
      <AppView className="flex-1 items-center justify-center px-6">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <IconSymbol name="exclamationmark.circle" size={32} color="#ef4444" />
        </View>
        <AppText center type="title" className="mb-2">
          Video not found
        </AppText>
        <AppText center className="mb-6 max-w-[280px] text-gray-500">
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
        }}
      />
      <FormProvider {...form}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          bottomOffset={100}
          className="flex-1 bg-white"
          contentContainerClassName="px-5 pt-6 pb-safe">
          <VideoPlayer uri={video.uri} className="mb-6" />
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
