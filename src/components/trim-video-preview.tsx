import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { formatTime } from '@/lib/utils';
import { AppText } from './app-text';

type IconName = 'play-arrow' | 'pause';

type TrimVideoPreviewProps = {
  uri: string;
  startTime: number;
  clipDuration?: number;
};

export function TrimVideoPreview({ uri, startTime, clipDuration = 5 }: TrimVideoPreviewProps) {
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [iconName, setIconName] = useState<IconName>('play-arrow');
  const iconOpacity = useSharedValue(0);
  const endTime = startTime + clipDuration;

  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.timeUpdateEventInterval = 0.1;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });

  const showIconTemporarily = (name: IconName) => {
    setIconName(name);
    iconOpacity.value = withTiming(1, { duration: 120 });
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      iconOpacity.value = withTiming(0, { duration: 250 });
    }, 650);
  };

  useEffect(() => {
    if (currentTime >= endTime) {
      player.currentTime = startTime;
      player.play();
    }
  }, [currentTime, endTime, player, startTime]);

  useEffect(() => {
    player.currentTime = startTime;

    if (!isPlaying) {
      player.play();
      showIconTemporarily('play-arrow');
    }
  }, [startTime, player]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const overlayIconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const handleTogglePlayback = () => {
    if (isPlaying) {
      player.pause();
      showIconTemporarily('pause');
      return;
    }

    player.play();
    showIconTemporarily('play-arrow');
  };

  return (
    <View className="items-center">
      <Pressable
        onPress={handleTogglePlayback}
        className="relative overflow-hidden rounded-2xl bg-black">
        <VideoView
          player={player}
          style={{ width: 350, height: 275 }}
          contentFit="contain"
          nativeControls={false}
        />

        <Animated.View
          pointerEvents="none"
          style={overlayIconStyle}
          className="absolute inset-0 items-center justify-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-black/50">
            <MaterialIcons name={iconName} size={40} color="white" />
          </View>
        </Animated.View>
      </Pressable>

      <View className="mt-3">
        <AppText className="text-center tabular-nums">
          {formatTime(currentTime)} / {formatTime(endTime)}
        </AppText>
      </View>
    </View>
  );
}
