import type { ImagePickerAsset } from 'expo-image-picker';

export type PickedVideoAsset = ImagePickerAsset;

export type SavedVideoDraft = {
  id: string;
  uri: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  createdAt: string;
};
