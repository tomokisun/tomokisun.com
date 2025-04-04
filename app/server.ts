import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { createApp } from 'honox/server'

const app = createApp()

app.use(logger());

app.use('/', async (c, next) => {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }
  await next();
})

showRoutes(app)

export default app
