import { useEffect } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/app-text';
import { cn } from '@/lib/utils';

type TrimScrubberProps = {
  duration: number;
  startTime: number;
  clipDuration?: number;
  onChange: (value: number) => void;
};

const TICK_COUNT = 20;

export function TrimScrubber({
  duration,
  startTime,
  clipDuration = 5,
  onChange,
}: TrimScrubberProps) {
  const trackWidth = useSharedValue(0);
  const rangeWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const maxStartTime = Math.max(duration - clipDuration, 0);
  const endTime = startTime + clipDuration;

  const syncRangeWithTime = () => {
    const maxX = trackWidth.value - rangeWidth.value;

    if (!trackWidth.value || maxX <= 0 || !maxStartTime) return;

    translateX.value = (startTime / maxStartTime) * maxX;
  };

  useEffect(() => {
    syncRangeWithTime();
  }, [startTime, maxStartTime]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    trackWidth.value = width;
    rangeWidth.value = duration > 0 ? (clipDuration / duration) * width : 0;

    syncRangeWithTime();
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const maxX = Math.max(trackWidth.value - rangeWidth.value, 0);

      const nextX = Math.min(Math.max(startX.value + event.translationX, 0), maxX);

      translateX.value = nextX;

      const nextStartTime = maxX > 0 ? (nextX / maxX) * maxStartTime : 0;

      scheduleOnRN(onChange, Number(nextStartTime.toFixed(1)));
    });

  const selectedRangeStyle = useAnimatedStyle(() => ({
    width: rangeWidth.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="mt-6 w-full px-5">
      <View className="mb-3 flex-row items-center justify-between">
        <AppText className="text-sm text-gray-500">Start: {startTime.toFixed(1)}s</AppText>
        <AppText className="text-sm text-gray-500">End: {endTime.toFixed(1)}s</AppText>
      </View>

      <View
        onLayout={handleLayout}
        className="relative h-12 justify-center overflow-hidden rounded-lg">
        <View className="h-8 flex-row items-center">
          {Array.from({ length: TICK_COUNT }).map((_, index) => (
            <View key={index} className="flex-1 items-center">
              <View
                className={cn('w-0.5', index % 5 === 0 ? 'h-6 bg-gray-400' : 'h-3 bg-gray-300')}
              />
            </View>
          ))}
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute h-8 rounded-lg border-2 border-indigo-500 bg-indigo-300/40"
            style={selectedRangeStyle}
          />
        </GestureDetector>
      </View>

      <AppText className="mt-2 text-center text-sm text-gray-500">
        Drag to select a 5-second segment.
      </AppText>
    </View>
  );
}
