import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'
import { drizzle } from 'drizzle-orm/d1';
import { GuestBooks } from '../database/schema';

export const POST = createRoute(async (c) => {
  const { username, body } = await c.req.parseBody<{ username: string, body: string }>();
  const db = drizzle(c.env.DB);
  await db.insert(GuestBooks).values({ username, body }).returning().get();
  alert('書き込みました！');
  return c.redirect('/')
});

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);
  return c.render(<HomePage c={c} />)
})
