import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';

export function PickedVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <>
      <VideoView player={player} className="aspect-video h-[275] w-[350]" />
      <View className="p-2.5">
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </>
  );
}
