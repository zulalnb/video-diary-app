import { Video } from '@/db/schema';
import {
  createVideo,
  deleteVideo,
  deleteVideos,
  getAllVideos,
  getVideoById,
  getVideosPage,
  updateVideo,
} from '@/queries/videos';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';

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
  return useInfiniteQuery({
    queryKey: ['videos'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getVideosPage({
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => lastPage.pagination.next,
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
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['video', variables.id], (old: Video | null | undefined) => {
        if (!old) return old;

        return {
          ...old,
          ...variables.video,
          updated_at: new Date().toISOString(),
        };
      });

      queryClient.setQueryData(['videos'], (old: Video[] | undefined) => {
        if (!old) return old;

        return old.map((item) =>
          item.id === variables.id
            ? {
                ...item,
                ...variables.video,
                updated_at: new Date().toISOString(),
              }
            : item
        );
      });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: async (_, id) => {
      await queryClient.cancelQueries({ queryKey: ['video', id] });
      await queryClient.cancelQueries({ queryKey: ['videos'] });

      queryClient.setQueryData(
        ['videos'],
        (old: Awaited<ReturnType<typeof getAllVideos>> | undefined) => {
          if (!old) return old;
          return old.filter((video) => video.id !== id);
        }
      );

      queryClient.removeQueries({ queryKey: ['video', id] });
    },
  });
}

export function useDeleteVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideos,
    onSuccess: async (_, ids) => {
      await queryClient.cancelQueries({ queryKey: ['videos'] });

      queryClient.setQueryData(
        ['videos'],
        (old: Awaited<ReturnType<typeof getAllVideos>> | undefined) => {
          if (!old) return old;
          return old.filter((video) => !ids.includes(video.id));
        }
      );
    },
  });
}

// Disabled in Expo Go. Real implementation works in development build.
export function useTrimVideo() {
  return useMutation({
    mutationFn: ({ uri, start, end }: { uri: string; start: number; end: number }) =>
      trimVideo({ uri, start, end }),
  });
}
