import { useVideoPlayer, VideoView } from 'expo-video';
import { View } from 'react-native';

export function PickedVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.play();
    player.loop = true;
  });

  return (
    <View className="aspect-video overflow-hidden rounded-xl bg-slate-600">
      <VideoView player={player} className="aspect-video" />
    </View>
  );
}
