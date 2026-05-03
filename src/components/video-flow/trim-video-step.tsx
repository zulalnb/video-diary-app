import { View } from 'react-native';

import { TrimScrubber } from '@/components/trim-scrubber';
import { CLIP_DURATION } from '@/constants/video-flow';
import type { PickedVideoAsset } from '@/types/video';
import { VideoPlayer } from '../video-player';

type TrimVideoStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  onChangeStartTime: (value: number) => void;
};

export function TrimVideoStep({ video, startTime, onChangeStartTime }: TrimVideoStepProps) {
  const durationInSeconds = video.duration ? video.duration / 1000 : 0;

  return (
    <View className="flex-[0.9] gap-4">
      {/* <TrimVideoPreview uri={video.uri} startTime={startTime} className="flex-1" /> */}
      <View className="flex-1 items-center justify-center">
        <VideoPlayer uri={video.uri} className="aspect-auto h-full" />
      </View>

      <TrimScrubber
        startTime={startTime}
        duration={durationInSeconds}
        clipDuration={CLIP_DURATION}
        onChange={onChangeStartTime}
      />
    </View>
  );
}
