import { MetadataForm } from '@/components/metadata-form';
import type { PickedVideoAsset } from '@/types/video';
import { VideoPlayer } from '../video-player';

type MetadataStepProps = {
  video: PickedVideoAsset;
  startTime: number;
  isSubmitting?: boolean;
  onSubmit: () => void;
};

export function MetadataStep({
  video,
  startTime,
  isSubmitting = false,
  onSubmit,
}: MetadataStepProps) {
  return (
    <>
      {/* <TrimVideoPreview uri={video.uri} startTime={startTime} className="mb-10 aspect-video" /> */}
      <VideoPlayer uri={video.uri} className="mb-10" />
      <MetadataForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </>
  );
}
