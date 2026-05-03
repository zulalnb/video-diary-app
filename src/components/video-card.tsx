import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Image, Pressable, PressableProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import type { Video } from '@/db/schema';
import { cn } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type VideoCardProps = Pick<Video, 'name' | 'thumbnail'> &
  PressableProps & {
    selected?: boolean;
    selectionMode?: boolean;
    createdAt: string;
  };

export function VideoCard({
  name,
  thumbnail,
  createdAt,
  selected = false,
  selectionMode = false,
  ...props
}: VideoCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      className="relative h-56 overflow-hidden rounded-2xl shadow active:opacity-80"
      {...props}>
      <Image
        source={{ uri: thumbnail }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(11,19,38,0)', 'rgba(11,19,38,0.9)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="absolute inset-0"
      />
      {selected && selectionMode && (
        <View className="absolute inset-0 z-10 rounded-2xl border-2 border-indigo-500" />
      )}

      {/* selection overlay */}
      {selectionMode && (
        <View className="absolute inset-0 ">
          <View
            className={cn(
              'absolute left-3 top-3 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black/40',
              selected && 'border-transparent bg-indigo-500'
            )}>
            {selected && <MaterialIcons name="check" size={18} color="white" />}
          </View>
        </View>
      )}

      {/* play icon */}
      {!selectionMode && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-slate-200/20">
            <MaterialIcons name="play-arrow" size={40} color="white" />
          </View>
        </View>
      )}

      {/* bottom metadata overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <AppText className="text-sm text-white/80">{formattedDate}</AppText>

        <AppText className="mt-0.5 text-base font-semibold text-white" numberOfLines={1}>
          {name}
        </AppText>
      </View>
    </Pressable>
  );
}

export function VideoCardSkeleton() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle} className="overflow-hidden rounded-2xl bg-white shadow">
      {/* Thumbnail */}
      <View className="h-48 w-full bg-gray-200" />
      {/* Content */}
      <View className="p-3">
        <View className="mb-2 h-4 w-2/3 rounded bg-gray-200" />
        <View className="h-3 w-full rounded bg-gray-200" />
      </View>
    </Animated.View>
  );
}
