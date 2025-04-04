import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const GuestBooks = sqliteTable('guest_books', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});
