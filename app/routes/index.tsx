import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'
import { drizzle } from 'drizzle-orm/d1';
import { GuestBooks } from '../database/schema';
import { GuestbookEntity } from '../types/guest-books';

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);

  const db = drizzle(c.env.DB);
  const guestBooks = await db.select().from(GuestBooks).all();

  const entities: GuestbookEntity[] = guestBooks.map(g => {
    return {
      name: g.username,
      date: '',
      content: g.body,
    }
  });

  console.log('[HomePage] entities', entities);

  return c.render(<HomePage c={c} entities={entities} />)
})
