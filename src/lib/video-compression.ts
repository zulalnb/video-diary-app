import { Platform } from 'react-native';
import { Video as VideoCompressor } from 'react-native-compressor';

const LARGE_VIDEO_LIMIT = 30 * 1024 * 1024; // 30MB

export async function compressVideoIfNeeded({
  uri,
  fileSize,
}: {
  uri: string;
  fileSize?: number | null;
}) {
  const shouldCompress = Platform.OS === 'android' && !!fileSize && fileSize > LARGE_VIDEO_LIMIT;
  if (!shouldCompress) {
    return uri;
  }

  return VideoCompressor.compress(uri, {
    compressionMethod: 'auto',
  });
}
