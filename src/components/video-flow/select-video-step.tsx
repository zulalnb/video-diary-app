import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoPlayer } from '@/components/video-player';
import { CLIP_DURATION } from '@/constants/video-flow';
import { compressVideoIfNeeded } from '@/lib/video-compression';
import type { PickedVideoAsset } from '@/types/video';
import colors from 'tailwindcss/colors';

type SelectVideoStepProps = {
  video: PickedVideoAsset | null;
  onSelectVideo: (video: PickedVideoAsset | null) => void;
};

export function SelectVideoStep({ video, onSelectVideo }: SelectVideoStepProps) {
  const [isPreparing, setIsPreparing] = useState(false);

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.5,
    });

    if (result.canceled) return;
    setIsPreparing(true);
    const pickedVideo = result.assets[0];
    const durationInSeconds = pickedVideo.duration ? pickedVideo.duration / 1000 : 0;

    if (durationInSeconds <= CLIP_DURATION) {
      setIsPreparing(false);
      Alert.alert('Video is too short', 'Please choose a video longer than 5 seconds.');
      return;
    }

    try {
      const compressedUri = await compressVideoIfNeeded({
        uri: pickedVideo.uri,
        fileSize: pickedVideo.fileSize,
      });

      onSelectVideo({
        ...pickedVideo,
        uri: compressedUri,
      });
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <View className="flex-1">
      {video ? (
        <View>
          <VideoPlayer uri={video.uri} />
          <View className="mt-4 flex-row gap-4">
            <Button
              title="Change"
              variant="secondary"
              onPress={pickVideo}
              className="mt-5 flex-1"
            />
            <Button
              title="Remove"
              variant="destructive"
              onPress={() => onSelectVideo(null)}
              className="mt-5 flex-1"
            />
          </View>
        </View>
      ) : (
        <Pressable onPress={pickVideo} disabled={isPreparing}>
          <View className="relative aspect-video items-center justify-center rounded-xl border border-dashed border-gray-400 px-5 py-14">
            <IconSymbol name="arrow.up.doc" size={48} color={colors.gray[400]} className="mb-2" />
            <AppText center className="w-9/12 text-gray-400">
              Pick a video longer than 5 seconds. You’ll select a 5-second moment next.
            </AppText>

            {/* Loading overlay */}
            {isPreparing && (
              <View className="absolute inset-0 items-center justify-center rounded-xl bg-white/80">
                <ActivityIndicator />
                <AppText center className="mt-3 text-sm text-gray-500">
                  Preparing video...
                </AppText>
              </View>
            )}
          </View>
        </Pressable>
      )}
      <AppText center className="mt-2 text-sm text-gray-600">
        Minimum duration: 5 seconds
      </AppText>
    </View>
  );
}
