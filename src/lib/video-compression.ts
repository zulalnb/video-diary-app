import * as Device from 'expo-device';
import { Video as VideoCompressor } from 'react-native-compressor';

const LARGE_VIDEO_LIMIT = 30 * 1024 * 1024; // 30MB

export async function compressVideoIfNeeded({
  uri,
  fileSize,
  onProgress,
  onCancellationId,
}: {
  uri: string;
  fileSize?: number | null;
  onProgress?: (progress: number) => void;
  onCancellationId?: (cancellationId: string) => void;
}) {
  const shouldCompress = Device.isDevice && !!fileSize && fileSize > LARGE_VIDEO_LIMIT;
  if (!shouldCompress) {
    return uri;
  }
  return VideoCompressor.compress(
    uri,
    {
      compressionMethod: 'auto',
      getCancellationId: onCancellationId,
    },
    onProgress
  );
}

export function cancelVideoCompression(cancellationId: string) {
  VideoCompressor.cancelCompression(cancellationId);
}
