import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

type IconName = 'play-arrow' | 'pause';

type TrimVideoPreviewProps = {
  uri: string;
  startTime: number;
  clipDuration?: number;
  className?: string;
  fullHeight?: boolean;
};

export function TrimVideoPreview({
  uri,
  startTime,
  clipDuration = 5,
  className,
  fullHeight = false,
}: TrimVideoPreviewProps) {
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStartRef = useRef(startTime);

  const [iconName, setIconName] = useState<IconName>('pause');

  const iconOpacity = useSharedValue(0);
  const endTime = startTime + clipDuration;

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.25;
    p.currentTime = startTime;
    p.play();
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

  const clearTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showIcon = (name: IconName) => {
    clearTimer();
    setIconName(name);
    iconOpacity.value = withTiming(1, { duration: 120 });
  };

  const showIconTemporarily = (name: IconName) => {
    showIcon(name);
    hideTimerRef.current = setTimeout(() => {
      iconOpacity.value = withTiming(0, { duration: 250 });
    }, 650);
  };

  // 1. onChange startTime seek + play
  useEffect(() => {
    if (prevStartRef.current === startTime) return;

    prevStartRef.current = startTime;

    player.currentTime = startTime;
    player.play();
    showIconTemporarily('pause');
  }, [startTime]);

  // 2. segment loop
  useEffect(() => {
    if (currentTime >= endTime) {
      player.currentTime = startTime;
      player.play();
    }
  }, [currentTime, endTime, startTime]);

  // 3. cleanup
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const handleTogglePlayback = () => {
    if (isPlaying) {
      player.pause();
      showIcon('play-arrow'); // kalıcı
    } else {
      player.play();
      showIconTemporarily('pause'); // geçici
    }
  };

  return (
    <View
      className={cn('relative items-center overflow-hidden rounded-xl bg-slate-600', className)}>
      <VideoView
        player={player}
        className={cn('aspect-video', !fullHeight ? 'w-full' : 'h-full')}
        contentFit="contain"
        nativeControls={false}
        surfaceType="textureView"
      />

      <Pressable
        onPress={handleTogglePlayback}
        className="absolute inset-0 items-center justify-center">
        <Animated.View pointerEvents="none" style={overlayStyle} className="">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-black/50">
            <MaterialIcons name={iconName} size={40} color="white" />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
