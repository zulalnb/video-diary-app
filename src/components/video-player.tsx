import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type PlayerInstance = ReturnType<typeof useVideoPlayer>;

type VideoPlayerProps = {
  uri?: string;
  player?: PlayerInstance;
  className?: string;
  nativeControls?: boolean;
  playFrom?: number;
};

export function VideoPlayer(props: VideoPlayerProps) {
  if (props.player) {
    return <VideoPlayerView {...props} player={props.player} />;
  }

  if (!props.uri) {
    throw new Error('VideoPlayer: either uri or player must be provided');
  }

  return <UncontrolledVideoPlayer {...props} uri={props.uri} />;
}

function VideoPlayerView({
  player,
  className,
  nativeControls = true,
  playFrom,
}: {
  player: PlayerInstance;
  className?: string;
  nativeControls?: boolean;
  playFrom?: number;
}) {
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    opacity.value = withTiming(isPlaying ? 0 : 1, { duration: 200 });
  });

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      if (typeof playFrom === 'number') {
        player.currentTime = playFrom;
      }

      player.play();
    }
  };

  return (
    <View
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-300/45',
        className
      )}>
      <VideoView
        player={player}
        className="h-full w-full"
        contentFit="contain"
        nativeControls={nativeControls}
        surfaceType="textureView"
      />

      {!nativeControls && (
        <Pressable onPress={togglePlay} className="absolute inset-0 items-center justify-center">
          <Animated.View style={animatedStyle}>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-black/50">
              <MaterialIcons name="play-arrow" size={36} color="white" />
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

function UncontrolledVideoPlayer({
  uri,
  ...props
}: Omit<VideoPlayerProps, 'player'> & { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.pause();
  });

  return <VideoPlayerView {...props} player={player} />;
}
