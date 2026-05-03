import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video-player';
import { CLIP_DURATION } from '@/constants/video-flow';
import type { PickedVideoAsset } from '@/types/video';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from 'tailwindcss/colors';

type SelectVideoStepProps = {
  video: PickedVideoAsset | null;
  onSelectVideo: (video: PickedVideoAsset | null) => void;
};

export function SelectVideoStep({ video, onSelectVideo }: SelectVideoStepProps) {
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

    const pickedVideo = result.assets[0];
    const durationInSeconds = pickedVideo.duration ? pickedVideo.duration / 1000 : 0;

    if (durationInSeconds <= CLIP_DURATION) {
      Alert.alert('Video is too short', 'Please choose a video longer than 5 seconds.');
      return;
    }

    onSelectVideo(pickedVideo);
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
        <Pressable onPress={pickVideo}>
          <View className="aspect-video items-center rounded-xl border border-dashed border-gray-400 px-5 py-14">
            <MaterialIcons name="file-upload" size={48} color={colors.gray[400]} className="mb-4" />
            <AppText center className="w-9/12 text-gray-400">
              Choose a video from your device to create a 5-second diary clip.
            </AppText>
          </View>
        </Pressable>
      )}
    </View>
  );
}
