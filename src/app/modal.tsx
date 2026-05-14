import { zodResolver } from '@hookform/resolvers/zod';
import { usePreventRemove } from '@react-navigation/native';
import { router, Stack, useNavigation } from 'expo-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Keyboard, Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { CLIP_DURATION, FALLBACK_THUMBNAIL, Step, STEPS } from '@/constants/video-flow';
import { useIsScreenActiveRef } from '@/hooks/use-is-screen-active';
import { useCreateVideo, useTrimVideo } from '@/hooks/use-videos';
import type { PickedVideoAsset } from '@/types/video';
import { videoMetadataSchema, type VideoMetadataFormValues } from '@/validations/metadata';
import Toast from 'react-native-toast-message';

import { Alert as InlineAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MetadataStep } from '@/components/video-flow/metadata-step';
import { SelectVideoStep } from '@/components/video-flow/select-video-step';
import { TrimVideoStep } from '@/components/video-flow/trim-video-step';
import { cn, generateThumbnail } from '@/lib/utils';

export default function ModalScreen() {
  const [step, setStep] = useState<Step>(STEPS.SELECT);
  const [video, setVideo] = useState<PickedVideoAsset | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const trimVideo = useTrimVideo();
  const createVideo = useCreateVideo();
  const isScreenActiveRef = useIsScreenActiveRef();

  const form = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const navigation = useNavigation();

  const shouldPreventClose = form.formState.isDirty && !isSaving;

  usePreventRemove(shouldPreventClose, ({ data }) => {
    Keyboard.dismiss();
    Alert.alert('Discard changes?', 'Your video details will be lost.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  const handleSelectVideo = (selectedVideo: PickedVideoAsset | null) => {
    setVideo(selectedVideo);
    setSaveErrorMessage(null);
    setStartTime(0);
    form.reset();
  };

  const handleNext = () => {
    if (step === STEPS.SELECT && video) {
      setStep(STEPS.TRIM);
      return;
    }

    if (step === STEPS.TRIM) {
      setSaveErrorMessage(null);
      setStep(STEPS.METADATA);
    }
  };

  const handleBack = () => {
    if (step === STEPS.METADATA) {
      setStep(STEPS.TRIM);
      return;
    }

    if (step === STEPS.TRIM) {
      setSaveErrorMessage(null);
      setStep(STEPS.SELECT);
      return;
    }

    router.dismissTo('/');
  };

  const handleSave = async (values: VideoMetadataFormValues) => {
    Keyboard.dismiss();

    if (!video) return;

    setIsSaving(true);
    setSaveErrorMessage(null);

    try {
      const thumbnail = await generateThumbnail(video.uri, Math.floor(startTime * 1000));

      const trimmed = await trimVideo.mutateAsync({
        uri: video.uri,
        start: startTime,
        end: startTime + CLIP_DURATION,
      });

      const payload = {
        uri: trimmed.uri,
        thumbnail: thumbnail ?? FALLBACK_THUMBNAIL,
        name: values.name,
        description: values.description ?? '',
      };

      const res = await createVideo.mutateAsync(payload);

      if (!isScreenActiveRef.current) return;

      form.reset(values);

      Toast.show({
        type: 'success',
        text1: 'Moment saved.',
      });

      requestAnimationFrame(() => {
        if (isScreenActiveRef.current) {
          router.replace(`/videos/${res[0].id}`);
        }
      });
    } catch (error) {
      if (!isScreenActiveRef.current) return;

      console.error('Video save failed:', error);
      setSaveErrorMessage('Your video could not be saved. Please try again.');
    } finally {
      if (isScreenActiveRef.current) {
        setIsSaving(false);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <Stack.Screen
        options={{
          headerTitle:
            step === STEPS.TRIM
              ? 'Trim Your Moment'
              : step === STEPS.METADATA
                ? 'Add Details'
                : 'Select Video',
          headerLeft: () =>
            Platform.OS === 'android' ? (
              <Button
                variant="ghost"
                onPress={() => router.dismissTo('/')}
                icon={<IconSymbol name="xmark" color="black" size={24} />}
              />
            ) : null,
          headerRight: () =>
            step === STEPS.METADATA ? (
              <Button
                hitSlop={8}
                title={isSaving ? 'Saving' : 'Save'}
                className="py-2.5"
                loading={isSaving}
                disabled={isSaving || !form.formState.isDirty}
                onPress={form.handleSubmit(handleSave)}
              />
            ) : null,
        }}
      />
      <KeyboardAwareScrollView
        className="flex-1 px-5 pt-10"
        contentContainerClassName={cn(step === STEPS.TRIM && 'flex-1')}
        scrollEnabled={step === STEPS.METADATA}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}>
        {step === STEPS.SELECT && (
          <SelectVideoStep video={video} onSelectVideo={handleSelectVideo} />
        )}
        {step === STEPS.TRIM && video && (
          <TrimVideoStep video={video} startTime={startTime} onChangeStartTime={setStartTime} />
        )}
        {step === STEPS.METADATA && video && <MetadataStep video={video} startTime={startTime} />}
      </KeyboardAwareScrollView>
      {step === STEPS.METADATA && saveErrorMessage && (
        <View className="px-5 pb-3">
          <InlineAlert variant="error" message={saveErrorMessage} />
        </View>
      )}
      <View className="flex-row items-center gap-3 px-5 pb-[calc(env(safe-area-inset-bottom)+20)]">
        {step !== STEPS.SELECT && (
          <View className="flex-1">
            <Button
              title="Back"
              variant="secondary"
              className="h-12"
              disabled={isSaving}
              onPress={handleBack}
            />
          </View>
        )}

        {step === STEPS.METADATA ? (
          <View className="flex-1">
            <Button
              title={isSaving ? 'Saving...' : 'Save'}
              loading={isSaving}
              disabled={isSaving || !form.formState.isDirty}
              onPress={form.handleSubmit(handleSave)}
              className="h-12"
            />
          </View>
        ) : (
          <View className="flex-1">
            <Button
              title={`Next: ${step === STEPS.SELECT ? 'Crop Video' : 'Add Details'}`}
              disabled={!video}
              onPress={handleNext}
              icon={<IconSymbol name="chevron.right" color="white" size={24} />}
              iconPosition="end"
              className="h-12"
            />
          </View>
        )}
      </View>
    </FormProvider>
  );
}
