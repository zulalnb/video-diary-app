import clsx, { type ClassValue } from 'clsx';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const generateThumbnail = async (video: string) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(video, {
      time: 1000,
    });
    return uri;
  } catch (e) {
    console.warn(e);
  }
};
