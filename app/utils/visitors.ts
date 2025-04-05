import { Context, Env } from 'hono';

/**
 * Increments the visitors count in KV storage
 * @param c Hono context
 * @returns The updated visitors count as a string
 */
export async function incrementVisitorsCount(c: Context<Env, any, {}>) {
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

/**
 * Retrieves the current visitors count from KV storage
 * @param c Hono context
 * @returns The current visitors count as a string
 */
export async function getVisitorsCount(c: Context<Env, any, {}>): Promise<string> {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  return visitorsCount ?? '0';
}