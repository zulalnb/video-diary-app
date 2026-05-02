import { eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { videos } from '@/db/schema';
import { simulateNetworkLatency } from './utils';

/**
 * Retrieves all videos from the database
 *
 * @remarks
 * This function queries the entire videos table without filtering.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves to an array of all video objects
 *
 * @example
 * ```typescript
 * const allVideos = await getAllVideos();
 * console.log(allVideos); // [{id: 1, name: 'My Birthday', ...}, ...]
 * ```
 */
export const getAllVideos = async () => {
  await simulateNetworkLatency();
  return db.select().from(videos).all();
};

/**
 *
 * Retrieves a specific video by its ID
 *
 * @param id - The unique identifier of the video to retrieve
 *
 * @remarks
 * This function performs an exact match on the video ID.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves to the video object if found, or undefined if not found
 *
 * @example
 * ```typescript
 * const video = await getVideoById(5);
 * if (video) {
 *   console.log(video.name); // "My Birthday"
 * } else {
 *   console.log("Video not found");
 * }
 * ```
 */
export const getVideoById = async (id: number) => {
  await simulateNetworkLatency();
  return db.select().from(videos).where(eq(videos.id, id)).get();
};

/**
 * Creates a new video with the specified URI and name
 *
 * @param video - An object containing the video properties
 * @param video.uri - The URI of the video to create
 * @param video.thumbnail - The thumbnail of the video to create
 * @param video.name - The name of the video to create
 * @param video.description - Optional description of the video to create
 *
 * @remarks
 * This function inserts a new record in the videos table.
 * The created_at and updated_at fields are automatically handled by the database.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves when the video is created
 *
 * @example
 * ```typescript
 * await createVideo({ uri: "https://example.com/my-birthday.mp4", thumbnail: "https://example.com/my-birthday-thumbnail.jpg", name: "My Birthday" });
 * ```
 */
export const createVideo = async (video: {
  uri: string;
  thumbnail: string;
  name: string;
  description?: string;
}) => {
  await simulateNetworkLatency();
  return db.insert(videos).values(video).run();
};

/**
 * Updates an existing video with new properties
 *
 * @param id - The unique identifier of the video to update
 * @param video - An object containing the video properties to update
 * @param video.name - The name of the video to update
 * @param video.description - Optional description of the video to update
 *
 * @remarks
 * This function updates the name and updated_at fields of the specified video.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves when the video is updated
 *-
 * @example
 * ```typescript
 * await updateVideo(5, { name: "My Best Birthday Ever", description: "Never forget this day!" });
 * ```
 */
export const updateVideo = async (
  id: number,
  video: Partial<{ name: string; description?: string }>
) => {
  await simulateNetworkLatency();
  return db
    .update(videos)
    .set({
      ...video,
      updated_at: new Date().toISOString(),
    })
    .where(eq(videos.id, id))
    .run();
};

/**
 * Deletes a video by its ID
 *
 * @param id - The unique identifier of the video to delete
 *
 * @remarks
 * This function removes the video from the database permanently.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves when the video is deleted
 *
 * @example
 * ```typescript
 * await deleteVideo(5);
 * ```
 */
export const deleteVideo = async (id: number) => {
  await simulateNetworkLatency();
  return db.delete(videos).where(eq(videos.id, id)).run();
};

/**
 * Deletes multiple videos by their IDs
 *
 * @param ids - An array of unique identifiers of the videos to delete
 *
 * @remarks
 * This function removes the specified videos from the database permanently.
 * Network latency is simulated to emulate real-world API behavior.
 *
 * @returns A promise that resolves when the videos are deleted
 *
 * @example
 * ```typescript
 * await deleteVideos([1, 2, 3]);
 * ```
 */
export const deleteVideos = async (ids: number[]) => {
  await simulateNetworkLatency();
  return db.delete(videos).where(inArray(videos.id, ids));
};
