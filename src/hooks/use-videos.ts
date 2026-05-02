import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { trimVideo } from 'expo-trim-video';
import {
  createVideo,
  deleteVideo,
  deleteVideos,
  getAllVideos,
  getVideoById,
  updateVideo,
} from '@/queries/videos';

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: getAllVideos,
  });
}

export function useVideoById(id: number) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
    enabled: !!id,
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      video,
    }: {
      id: number;
      video: Partial<{ name: string; description?: string }>;
    }) => updateVideo(id, video),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['video', variable.id] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.removeQueries({ queryKey: ['video', id] });
    },
  });
}

export function useDeleteVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// Disabled in Expo Go. Real implementation works in development build.
/* export function useTrimVideo() {
  return useMutation({
    mutationFn: ({ uri, start, end }: { uri: string; start: number; end: number }) =>
      trimVideo({ uri, start, end }),
  });
} */
