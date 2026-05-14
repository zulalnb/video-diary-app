import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { CLIP_DURATION } from '@/constants/video-flow';
import { AppText } from './app-text';

const groupCount = 5;
const TICK_COUNT = groupCount * 5 + 1;
const MIN_RANGE_WIDTH = 48;

type ScrubberProps = {
  startTime?: number;
  duration?: number;
  videoDuration: number;
  onChange: (value: number) => void;
};

export function Scrubber({
  startTime = 0,
  duration = CLIP_DURATION,
  videoDuration,
  onChange,
}: ScrubberProps) {
  const [scrubberWidth, setScrubberWidth] = useState(0);
  const scale = useSharedValue(1);

  const safeDuration = Math.min(duration, videoDuration);
  const maxStartTime = Math.max(0, videoDuration - safeDuration);
  const safeStartTime = Math.max(0, Math.min(startTime, maxStartTime));

  const rawRangeWidth = videoDuration > 0 ? scrubberWidth * (safeDuration / videoDuration) : 0;

  const rangeWidth =
    scrubberWidth > 0 ? Math.min(scrubberWidth, Math.max(rawRangeWidth, MIN_RANGE_WIDTH)) : 0;

  const initialStartX = videoDuration > 0 ? scrubberWidth * (safeStartTime / videoDuration) : 0;

  const startX = useSharedValue(0);
  const gestureStartX = useSharedValue(0);

  const maxStartX = Math.max(0, scrubberWidth - rangeWidth);

  useEffect(() => {
    startX.value = Math.max(0, Math.min(initialStartX, maxStartX));
  }, [initialStartX, maxStartX]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      gestureStartX.value = startX.value;
      scale.value = withTiming(1.1, { duration: 120 });
    })
    .onUpdate((event) => {
      const nextX = gestureStartX.value + event.translationX;

      startX.value = Math.max(0, Math.min(nextX, maxStartX));

      const nextStartTime =
        scrubberWidth > 0 && videoDuration > 0 ? (startX.value / scrubberWidth) * videoDuration : 0;

      scheduleOnRN(onChange, nextStartTime);
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 120 });

      const nextStartTime =
        scrubberWidth > 0 && videoDuration > 0 ? (startX.value / scrubberWidth) * videoDuration : 0;

      scheduleOnRN(onChange, nextStartTime);
    });

  const selectedRangeStyle = useAnimatedStyle(() => {
    return {
      width: rangeWidth,
      transform: [{ translateX: startX.value }, { scale: scale.value }],
    };
  });

  return (
    <View>
      <AppText center className="mb-6 text-sm text-gray-500">
        Drag to select a 5-second segment.
      </AppText>

      <View className="mb-3 flex-row items-center justify-between">
        <AppText className="text-sm text-gray-500">Start: {startTime.toFixed(1)}s</AppText>
        <AppText className="text-sm text-gray-500">
          End: {(startTime + duration).toFixed(1)}s
        </AppText>
      </View>

      <View
        className="relative h-12 justify-center"
        onLayout={(event) => {
          setScrubberWidth(event.nativeEvent.layout.width);
        }}>
        <View className="h-8 flex-row items-center justify-between">
          {Array.from({ length: TICK_COUNT }).map((_, index) => {
            const isBigTick = index % 5 === 0;

            return (
              <View key={index} className="items-center">
                <View className={isBigTick ? 'h-6 w-0.5 bg-gray-400' : 'h-3 w-0.5 bg-gray-300'} />
              </View>
            );
          })}
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute h-8 rounded-lg border-2 border-indigo-500 bg-indigo-300/60"
            style={selectedRangeStyle}>
            <View className="absolute bottom-0 left-0 top-0 w-1 rounded-l-sm bg-indigo-600" />
            <View className="absolute bottom-0 right-0 top-0 w-1 rounded-r-sm bg-indigo-600" />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
