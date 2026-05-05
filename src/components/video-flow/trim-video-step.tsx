import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useState } from 'react';
import { View } from 'react-native';

import { Scrubber } from '@/components/scrubber';
import { VideoPlayer } from '@/components/video-player';
import { CLIP_DURATION } from '@/constants/video-flow';
import useThrottle from '@/hooks/use-throttle';
import type { PickedVideoAsset } from '@/types/video';

type TrimVideoStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  onChangeStartTime: (value: number) => void;
};

export function TrimVideoStep({ video, startTime, onChangeStartTime }: TrimVideoStepProps) {
  const durationInSeconds = video.duration ? video.duration / 1000 : 0;
  const [previewStartTime, setPreviewStartTime] = useState(startTime);

  const player = useVideoPlayer(video.uri, (player) => {
    player.currentTime = startTime;
    player.loop = false;
    player.pause();
    player.timeUpdateEventInterval = 0.05;
  });

  useEventListener(player, 'timeUpdate', (event) => {
    const currentTime = event.currentTime;

    if (currentTime >= startTime + CLIP_DURATION) {
      // player.currentTime = startTime;
      player.pause();
    }
  });

  const throttledPreviewChange = useThrottle((value: number) => {
    setPreviewStartTime(value);
  }, 100);

  return (
    <View className="flex-[0.9] gap-4">
      <View className="flex-1 items-center justify-center">
        <VideoPlayer
          className="aspect-auto h-full"
          nativeControls={false}
          player={player}
          playFrom={startTime}
        />
      </View>

      <Scrubber
        videoDuration={durationInSeconds}
        startTime={startTime}
        previewStartTime={previewStartTime}
        onPreviewChange={throttledPreviewChange}
        onChange={(value) => {
          onChangeStartTime(value);
          setPreviewStartTime(value);
          player.currentTime = value;
        }}
      />
    </View>
  );
}
