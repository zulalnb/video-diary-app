import { router } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { MetadataStep } from '@/components/video-flow/metadata-step';
import { SelectVideoStep } from '@/components/video-flow/select-video-step';
import { TrimVideoStep } from '@/components/video-flow/trim-video-step';
import { STEPS, Step } from '@/constants/video-flow';
import { useCreateVideo } from '@/hooks/use-videos';
import type { VideoMetadataFormValues } from '@/schemas/metadata';
import type { PickedVideoAsset } from '@/types/video';

export default function ModalScreen() {
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>(STEPS.SELECT);
  const [video, setVideo] = useState<PickedVideoAsset | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // const trimVideoMutation = useTrimVideo();
  const createVideo = useCreateVideo();

  const handleSelectVideo = (selectedVideo: PickedVideoAsset) => {
    setVideo(selectedVideo);
    setStartTime(0);
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
    <View className="flex-1 px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      {step === STEPS.SELECT && <SelectVideoStep video={video} onSelectVideo={handleSelectVideo} />}
      {step === STEPS.TRIM && video && (
        <TrimVideoStep video={video} startTime={startTime} onChangeStartTime={setStartTime} />
      )}
      {step === STEPS.METADATA && video && (
        <MetadataStep
          video={video}
          startTime={startTime}
          isSubmitting={isSaving}
          onSubmit={handleSave}
        />
      )}

      <View className="w-full flex-row items-center justify-between">
        <Button title="Back" variant="secondary" onPress={handleBack} />

        {step !== STEPS.METADATA && <Button title="Next" disabled={!video} onPress={handleNext} />}
      </View>
    </View>
  );
}
7;
