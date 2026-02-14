import type { AppContext } from '../global';

const KV_KEY = 'VISITORS_COUNT';
const DEFAULT_COUNT = '0';

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Increments the visitors count in KV storage
 * @param c Hono context
 * @returns The updated visitors count as a string
 */
export async function incrementVisitorsCount(c: AppContext): Promise<string> {
  try {
    const current = await c.env.KV.get(KV_KEY);
    const next = (Number(current ?? 0) + 1).toString();
    await c.env.KV.put(KV_KEY, next);
    return next;
  } catch (error) {
    console.error('Failed to increment visitors count:', formatError(error));
    return DEFAULT_COUNT;
  }
}

/**
 * Retrieves the current visitors count from KV storage
 * @param c Hono context
 * @returns The current visitors count as a string
 */
export async function getVisitorsCount(c: AppContext): Promise<string> {
  try {
    const visitorsCount = await c.env.KV.get(KV_KEY);
    return visitorsCount ?? DEFAULT_COUNT;
  } catch (error) {
    console.error('Failed to get visitors count:', formatError(error));
    return DEFAULT_COUNT;
  }
}
