import { drizzle } from 'drizzle-orm/d1';
import { Env, Hono } from 'hono';
import { GuestBooks } from './database/schema';
import { zValidator } from '@hono/zod-validator';
import { createGuestBookSchema } from './types/guest-books';

const api = new Hono<Env>();

api.get('/guest_books', async (c) => {
  const db = drizzle(c.env.DB);
  const guestBooks = await db.select().from(GuestBooks).all();
  return c.json(guestBooks);
});

api.post('/guest_books', zValidator('json', createGuestBookSchema), async (c) => {
  const { username, body } = await c.req.valid('json');
  const db = drizzle(c.env.DB);
  const guestBook = await db.insert(GuestBooks).values({ username, body }).returning().get();
  return c.json(guestBook);
});

export default api;
