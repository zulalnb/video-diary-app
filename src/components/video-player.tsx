import { cn } from '@/lib/utils';
import { useVideoPlayer, VideoView } from 'expo-video';

export function VideoPlayer({ uri, className }: { uri: string; className?: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.pause();
  });

  return (
    <VideoView
      player={player}
      className={cn('aspect-video w-full rounded-2xl bg-slate-300/45', className)}
      contentFit="contain"
      nativeControls
      surfaceType="textureView"
    />
  );
}
