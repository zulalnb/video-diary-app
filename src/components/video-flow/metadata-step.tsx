import { View } from 'react-native';

import { MetadataForm } from '@/components/metadata-form';
import { TrimVideoPreview } from '@/components/trim-video-preview';
import type { PickedVideoAsset } from '@/types/video';
import { AppText } from '../app-text';

type MetadataStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  isSubmitting?: boolean;
  onSubmit: () => void;
};

export function MetadataStep({
  video,
  startTime,
  isSubmitting = false,
  onSubmit,
}: MetadataStepProps) {
  return (
    <View className="flex-1 gap-3">
      <AppText type="title" className="mb-2 text-center">
        Add details
      </AppText>

      <TrimVideoPreview uri={video.uri} startTime={startTime} className="flex-[0.6]" fullHeight />

      <MetadataForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </View>
  );
}
