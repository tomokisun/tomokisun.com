import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { Context, Env } from 'hono';

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);
  return c.render(<HomePage c={c} />)
})

async function incrementVisitorsCount(c: Context<Env, any, {}>) {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }
  return visitorsCount;
}
