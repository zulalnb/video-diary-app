import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { MetadataForm } from '@/components/metadata-form';
import { TrimVideoPreview } from '@/components/trim-video-preview';
import { CLIP_DURATION } from '@/constants/video-flow';
import { formatTime } from '@/lib/utils';
import type { VideoMetadataFormValues } from '@/schemas/metadata';
import type { PickedVideoAsset } from '@/types/video';

type MetadataStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  isSubmitting?: boolean;
  onSubmit: (values: VideoMetadataFormValues) => void;
};

export function MetadataStep({
  video,
  startTime,
  isSubmitting = false,
  onSubmit,
}: MetadataStepProps) {
  const endTime = startTime + CLIP_DURATION;

  return (
    <View className="flex-1 justify-center gap-6">
      <View>
        <AppText type="title" className="mb-2 text-center">
          Add details
        </AppText>

        <AppText className="text-center text-gray-500">
          Clip: {formatTime(startTime)} - {formatTime(endTime)}
        </AppText>
      </View>

      <TrimVideoPreview uri={video.uri} startTime={startTime} />

      <MetadataForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </View>
  );
}
