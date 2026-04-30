import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { TrimScrubber } from '@/components/trim-scrubber';
import { TrimVideoPreview } from '@/components/trim-video-preview';
import { CLIP_DURATION } from '@/constants/video-flow';
import { formatTime } from '@/lib/utils';
import type { PickedVideoAsset } from '@/types/video';

type TrimVideoStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  onChangeStartTime: (value: number) => void;
};

export function TrimVideoStep({ video, startTime, onChangeStartTime }: TrimVideoStepProps) {
  const durationInSeconds = video.duration ? video.duration / 1000 : 0;
  const endTime = startTime + CLIP_DURATION;

  return (
    <View className="flex-1 items-center justify-center">
      <AppText type="title" className="mb-2 text-center">
        Trim your moment
      </AppText>

      <AppText className="mb-4 text-center text-gray-500">
        Selected clip: {formatTime(startTime)} - {formatTime(endTime)}
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
