import { MetadataForm } from '@/components/metadata-form';
import { VideoPlayer } from '@/components/video-player';
import type { PickedVideoAsset } from '@/types/video';
import { useVideoPlayer } from 'expo-video';

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
  const player = useVideoPlayer(video.uri, (player) => {
    player.currentTime = startTime;
    player.loop = false;
    player.pause();
    player.timeUpdateEventInterval = 0.05;
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
      <MetadataForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </>
  );
}
