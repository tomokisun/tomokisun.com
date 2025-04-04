import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'
import { drizzle } from 'drizzle-orm/d1';
import { GuestBooks } from '../database/schema';
import { zValidator } from '@hono/zod-validator';
import { createGuestBookSchema, transformGuestBookEntity } from '../types/guest-books';

export const POST = createRoute(zValidator('form', createGuestBookSchema), async (c) => {
  const { username, body } = c.req.valid('form');
  const db = drizzle(c.env.DB);
  await db.insert(GuestBooks).values({ username, body }).returning().get();
  return c.redirect('/')
});

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);

  const db = drizzle(c.env.DB);
  const res = await db.select().from(GuestBooks).orderBy(GuestBooks.createdAt).limit(5);
  const guestBooks = res.map(transformGuestBookEntity);
  return c.render(<HomePage c={c} guestBooks={guestBooks} />)
})
