export const CLIP_DURATION = 5;

export const STEPS = {
  SELECT: 'select',
  TRIM: 'trim',
  METADATA: 'metadata',
} as const;

export type Step = (typeof STEPS)[keyof typeof STEPS];
