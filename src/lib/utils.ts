import clsx, { type ClassValue } from 'clsx';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const generateThumbnail = async (video: string, startTime: number = 1000) => {
  const fallbackTimes = [
    startTime,
    startTime + 1000,
    startTime + 2000,
    startTime + 3000,
    startTime + 4000,
  ];

  try {
    const fastestThumbnail = await Promise.any(
      fallbackTimes.map((time) => VideoThumbnails.getThumbnailAsync(video, { time, quality: 0.5 }))
    );

    return fastestThumbnail.uri;
  } catch {
    return null;
  }
};
