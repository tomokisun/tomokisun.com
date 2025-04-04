import { drizzle } from 'drizzle-orm/d1';
import { Env, Hono } from 'hono';
import { GuestBooks } from '../database/schema';

const app = new Hono<Env>();

app.get('/guest_books', async (c) => {
  const db = drizzle(c.env.DB);
  const guestBooks = await db.select().from(GuestBooks).all();
  return c.json(guestBooks);
})

const apiRoute = app;

export default apiRoute;
