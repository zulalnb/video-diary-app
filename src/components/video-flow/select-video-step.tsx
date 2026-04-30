import * as ImagePicker from 'expo-image-picker';
import { Alert, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PickedVideo } from '@/components/picked-video';
import { Button } from '@/components/ui/button';
import { CLIP_DURATION } from '@/constants/video-flow';
import type { PickedVideoAsset } from '@/types/video';

type SelectVideoStepProps = {
  video: PickedVideoAsset | null;
  onSelectVideo: (video: PickedVideoAsset) => void;
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
      quality: 1,
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
    <View className="flex-1 items-center justify-center">
      {video ? (
        <PickedVideo uri={video.uri} />
      ) : (
        <>
          <AppText type="title" className="mb-2 text-center">
            Select a video
          </AppText>

          <AppText className="mb-4 text-center">
            Choose a video from your device to create a 5-second diary clip.
          </AppText>
        </>
      )}

      <Button title="Choose a video" onPress={pickVideo} />
    </View>
  );
}
