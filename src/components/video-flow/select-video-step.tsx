import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Alert } from '@/components/ui/alert';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      setErrorMessage(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        quality: 1,
      });

      if (result.canceled) return;

      setIsPreparing(true);

      const pickedVideo = result.assets[0];

      if (!pickedVideo) {
        setErrorMessage('Video could not be selected. Please try again.');
        return;
      }

      const durationInSeconds = pickedVideo?.duration ? pickedVideo.duration / 1000 : 0;

      if (durationInSeconds <= CLIP_DURATION) {
        setErrorMessage('Please choose a video longer than 5 seconds.');
        return;
      }

      const compressedUri = await compressVideoIfNeeded({
        uri: pickedVideo.uri,
        fileSize: pickedVideo.fileSize,
      });

      onSelectVideo({
        ...pickedVideo,
        uri: compressedUri,
      });
    } catch (error) {
      console.error('Failed to prepare video:', error);

      setErrorMessage('The video could not be prepared. Please try another video.');
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

      {errorMessage && <Alert variant="error" message={errorMessage} />}
    </View>
  );
}
