import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'

export default createRoute(async (c) => {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }

  return c.render(<HomePage c={c} />)
})
