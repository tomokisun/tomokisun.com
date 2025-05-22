import type {} from 'hono'

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      KV: KVNamespace,
      DB: D1Database,
      VISITORS: KVNamespace,
      CAPTCHA: KVNamespace,
      RATE_LIMIT: KVNamespace,
    }
  }
}
