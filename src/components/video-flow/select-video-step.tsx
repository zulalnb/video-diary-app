import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoPlayer } from '@/components/video-player';
import { CLIP_DURATION } from '@/constants/video-flow';
import { cancelVideoCompression, compressVideoIfNeeded } from '@/lib/video-compression';
import type { PickedVideoAsset } from '@/types/video';
import colors from 'tailwindcss/colors';

type SelectVideoStepProps = {
  video: PickedVideoAsset | null;
  onSelectVideo: (video: PickedVideoAsset | null) => void;
};

export function SelectVideoStep({ video, onSelectVideo }: SelectVideoStepProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isCancellingCompression, setIsCancellingCompression] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const compressionCancellationIdRef = useRef<string | null>(null);
  const wasCompressionCancelledRef = useRef(false);

  const compressionPercent =
    compressionProgress === null ? null : Math.round(compressionProgress * 100);

  const pickVideo = async () => {
    try {
      setErrorMessage(null);
      setCompressionProgress(null);
      setIsCancellingCompression(false);
      compressionCancellationIdRef.current = null;
      wasCompressionCancelledRef.current = false;
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        onProgress: (progress) => {
          setCompressionProgress(Math.max(0, Math.min(progress, 1)));
        },
        onCancellationId: (cancellationId) => {
          compressionCancellationIdRef.current = cancellationId;
        },
      });

      if (wasCompressionCancelledRef.current) return;

      onSelectVideo({
        ...pickedVideo,
        uri: compressedUri,
      });
    } catch (error) {
      if (wasCompressionCancelledRef.current) return;

      console.error('Failed to prepare video:', error);

      setErrorMessage('The video could not be prepared. Please try another video.');
    } finally {
      setIsPreparing(false);
      setIsCancellingCompression(false);
      setCompressionProgress(null);
      compressionCancellationIdRef.current = null;
      wasCompressionCancelledRef.current = false;
    }
  };

  const handleCancelCompression = () => {
    wasCompressionCancelledRef.current = true;
    setIsCancellingCompression(true);

    if (compressionCancellationIdRef.current) {
      cancelVideoCompression(compressionCancellationIdRef.current);
    }
  };

  return (
    <View className="relative flex-1">
      {video ? (
        <View>
          <VideoPlayer uri={video.uri} />

          <View className="mt-4 flex-row gap-4">
            <Button
              title="Change"
              variant="secondary"
              onPress={pickVideo}
              className="mt-5 flex-1"
              disabled={isPreparing}
            />

            <Button
              title="Remove"
              variant="destructive"
              onPress={() => onSelectVideo(null)}
              className="mt-5 flex-1"
              disabled={isPreparing}
            />
          </View>
        </View>
      ) : (
        <Pressable onPress={pickVideo} disabled={isPreparing}>
          <View className="aspect-video items-center justify-center rounded-xl border border-dashed border-gray-400 px-5 py-14">
            <IconSymbol name="arrow.up.doc" size={48} color={colors.gray[400]} className="mb-2" />

            <AppText center className="w-9/12 text-gray-400">
              Pick a video longer than 5 seconds. You’ll select a 5-second moment next.
            </AppText>
          </View>
        </Pressable>
      )}

      {isPreparing && (
        <View className="absolute inset-0 z-10 items-center justify-center rounded-xl bg-white/80">
          <ActivityIndicator />

          <AppText center className="mt-3 text-sm text-gray-500">
            {isCancellingCompression
              ? 'Cancelling compression...'
              : compressionPercent === null
                ? 'Preparing video...'
                : `Compressing video... ${compressionPercent}%`}
          </AppText>

          {compressionPercent !== null && (
            <View className="mt-4 h-2 w-8/12 overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${compressionPercent}%` }}
              />
            </View>
          )}

          {compressionPercent !== null && (
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancelCompression}
              disabled={isCancellingCompression}
              className="mt-5 min-w-32"
            />
          )}
        </View>
      )}

      <AppText center className="mt-2 text-sm text-gray-600">
        Minimum duration: 5 seconds
      </AppText>

      {errorMessage && <Alert variant="error" message={errorMessage} />}
    </View>
  );
}
