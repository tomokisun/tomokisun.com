import type { KVNamespace } from '@cloudflare/workers-types'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const KV_KEY = 'VISITORS_COUNT'

export async function incrementVisitorsCount(): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const kv = (env as { KV: KVNamespace }).KV
    const current = await kv.get(KV_KEY)
    const next = (Number(current ?? 0) + 1).toString()
    await kv.put(KV_KEY, next)
    return next
  } catch (error) {
    console.error('Failed to increment visitors count:', error)
    return '0'
  }
}

export async function getVisitorsCount(): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const kv = (env as { KV: KVNamespace }).KV
    const count = await kv.get(KV_KEY)
    return count ?? '0'
  } catch (error) {
    console.error('Failed to get visitors count:', error)
    return '0'
  }
}
