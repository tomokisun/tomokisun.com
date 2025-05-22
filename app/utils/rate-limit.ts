import { Context } from 'hono'
import { Env } from 'hono'

// IPアドレスごとの投稿レート制限
export async function checkRateLimit(
  c: Context<Env, any, {}>,
  ipAddress: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const rateLimitKV = c.env.RATE_LIMIT as KVNamespace
  const key = `rate:${ipAddress}`
  
  // 現在の投稿回数を取得
  const currentData = await rateLimitKV.get(key)
  const now = Date.now()
  
  if (!currentData) {
    // 初回投稿
    await rateLimitKV.put(
      key,
      JSON.stringify({ count: 1, firstPost: now }),
      { expirationTtl: 3600 } // 1時間
    )
    return { allowed: true }
  }
  
  const { count, firstPost } = JSON.parse(currentData)
  const elapsedTime = now - firstPost
  
  // 1時間に3回まで
  const maxPosts = 3
  const timeWindow = 3600000 // 1時間（ミリ秒）
  
  if (count >= maxPosts) {
    const retryAfter = Math.ceil((timeWindow - elapsedTime) / 1000)
    return { allowed: false, retryAfter }
  }
  
  // カウントを増やす
  await rateLimitKV.put(
    key,
    JSON.stringify({ count: count + 1, firstPost }),
    { expirationTtl: Math.ceil((timeWindow - elapsedTime) / 1000) }
  )
  
  return { allowed: true }
}

// IPアドレスを取得
export function getClientIP(c: Context<Env, any, {}>): string {
  // Cloudflare環境では CF-Connecting-IP ヘッダーから取得
  const cfIP = c.req.header('CF-Connecting-IP')
  if (cfIP) return cfIP
  
  // その他の環境
  const xForwardedFor = c.req.header('X-Forwarded-For')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  
  // フォールバック
  return c.req.header('X-Real-IP') || 'unknown'
}