import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';

import { MetadataForm } from '@/components/metadata-form';
import { VideoPlayer } from '@/components/video-player';
import { CLIP_DURATION } from '@/constants/video-flow';
import type { PickedVideoAsset } from '@/types/video';

type MetadataStepProps = {
  video: PickedVideoAsset;
  startTime: number;
};

export function MetadataStep({ video, startTime }: MetadataStepProps) {
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

  return (
    <>
      <VideoPlayer
        uri={video.uri}
        className="mb-10"
        player={player}
        playFrom={startTime}
        nativeControls={false}
      />
      <MetadataForm />
    </>
  );
}
