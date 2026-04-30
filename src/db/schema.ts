import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uri: text('uri').notNull(),
  thumbnail: text('thumbnail').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  created_at: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Video = typeof videos.$inferSelect;
