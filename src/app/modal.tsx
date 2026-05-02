import { zodResolver } from '@hookform/resolvers/zod';
import { router, useNavigation } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Keyboard, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAvoidingView, KeyboardEvents } from 'react-native-keyboard-controller';

import { STEPS, Step } from '@/constants/video-flow';
import { useCreateVideo } from '@/hooks/use-videos';
import { videoMetadataSchema, type VideoMetadataFormValues } from '@/schemas/metadata';
import type { PickedVideoAsset } from '@/types/video';

import { Button } from '@/components/ui/button';
import { MetadataStep } from '@/components/video-flow/metadata-step';
import { SelectVideoStep } from '@/components/video-flow/select-video-step';
import { TrimVideoStep } from '@/components/video-flow/trim-video-step';
import { usePreventRemove } from '@react-navigation/native';

export default function ModalScreen() {
  const [step, setStep] = useState<Step>(STEPS.SELECT);
  const [video, setVideo] = useState<PickedVideoAsset | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);

  // const trimVideoMutation = useTrimVideo();
  const createVideo = useCreateVideo();

  const form = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const navigation = useNavigation();

  const shouldPreventClose = form.formState.isDirty && !isSaving && !form.formState.isSubmitted;

  usePreventRemove(shouldPreventClose, ({ data }) => {
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

  useEffect(() => {
    const showSubscription = KeyboardEvents.addListener('keyboardWillShow', () => {
      setKeyboardShown(true);
    });

    const hideSubscription = KeyboardEvents.addListener('keyboardWillHide', () => {
      setKeyboardShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSelectVideo = (selectedVideo: PickedVideoAsset | null) => {
    setVideo(selectedVideo);
    setStartTime(0);
    form.reset();
  };

  const handleNext = () => {
    if (step === STEPS.SELECT && video) {
      setStep(STEPS.TRIM);
      return;
    }

    if (step === STEPS.TRIM) {
      setStep(STEPS.METADATA);
    }
  };

  const handleBack = () => {
    if (step === STEPS.METADATA) {
      setStep(STEPS.TRIM);
      return;
    }

    if (step === STEPS.TRIM) {
      setStep(STEPS.SELECT);
      return;
    }

    router.dismissTo('/');
  };

  const generateThumbnail = async (video: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(video, {
        time: 1000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSave = async (values: VideoMetadataFormValues) => {
    if (!video) return;

    setIsSaving(true);

    try {
      /* const trimmed = await trimVideoMutation.mutateAsync({
        uri: video.uri,
        start: startTime,
        end: startTime + CLIP_DURATION,
      }); */

      const thumbnail = await generateThumbnail(video.uri);

      const payload = {
        uri: video.uri,
        thumbnail: thumbnail ?? '',
        name: values.name,
        description: values.description ?? '',
      };

      createVideo.mutate(payload, {
        onSuccess: () => {
          router.dismissTo('/');
        },
        onSettled() {
          setIsSaving(false);
        },
      });
    } catch (error) {
      console.error('Video save failed:', error);
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...form}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} className="flex-1">
        <KeyboardAvoidingView
          className="pb-safe flex-1 px-5 pt-[calc(env(safe-area-inset-top)+5)]"
          behavior={'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : -40}>
          <View className="flex-1">
            {step === STEPS.SELECT && (
              <SelectVideoStep video={video} onSelectVideo={handleSelectVideo} />
            )}
            {step === STEPS.TRIM && video && (
              <TrimVideoStep video={video} startTime={startTime} onChangeStartTime={setStartTime} />
            )}
            {step === STEPS.METADATA && video && (
              <MetadataStep
                video={video}
                startTime={startTime}
                isSubmitting={isSaving}
                onSubmit={form.handleSubmit(handleSave)}
              />
            )}
          </View>
          <View className="w-full pb-12">
            <View className="flex-row gap-8">
              {!keyboardShown && (
                <Button
                  title="Back"
                  variant="secondary"
                  disabled={isSaving}
                  onPress={handleBack}
                  className="flex-1"
                />
              )}

              {step === STEPS.METADATA ? (
                <Button
                  title={isSaving ? 'Saving...' : 'Save'}
                  loading={isSaving}
                  disabled={isSaving || !form.formState.isDirty}
                  onPress={form.handleSubmit(handleSave)}
                  className="flex-1"
                />
              ) : (
                <Button title="Next" disabled={!video} onPress={handleNext} className="flex-1" />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
}
