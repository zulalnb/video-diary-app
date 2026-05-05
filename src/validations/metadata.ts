import z from 'zod/v3';

export const videoMetadataSchema = z.object({
  name: z.string().min(1, 'Please enter a name for your video'),
  description: z.string().optional(),
});

export type VideoMetadataFormValues = z.infer<typeof videoMetadataSchema>;
