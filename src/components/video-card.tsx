import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/app-text';

type VideoCardProps = {
  id: number;
  thumbnail: string;
  name: string;
};

export function VideoCard({ id, thumbnail, name }: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`} asChild>
      <Pressable className="overflow-hidden rounded-2xl bg-white shadow active:opacity-80">
        <Image source={{ uri: thumbnail }} className="h-48 w-full" resizeMode="cover" />

        <View className="p-3">
          <AppText className="text-base font-semibold">{name}</AppText>
        </View>
      </Pressable>
    </Link>
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
