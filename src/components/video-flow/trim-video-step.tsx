import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { TrimScrubber } from '@/components/trim-scrubber';
import { CLIP_DURATION } from '@/constants/video-flow';
import type { PickedVideoAsset } from '@/types/video';
import { TrimVideoPreview } from '../trim-video-preview';

type TrimVideoStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  onChangeStartTime: (value: number) => void;
};

export function TrimVideoStep({ video, startTime, onChangeStartTime }: TrimVideoStepProps) {
  const durationInSeconds = video.duration ? video.duration / 1000 : 0;

  return (
    <View className="flex-1">
      <AppText type="title" className="mb-10 text-center">
        Trim your moment
      </AppText>

      <TrimVideoPreview uri={video.uri} startTime={startTime} />

      <TrimScrubber
        startTime={startTime}
        duration={durationInSeconds}
        clipDuration={CLIP_DURATION}
        onChange={onChangeStartTime}
      />
    </View>
  );
}
