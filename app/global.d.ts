import type {} from 'hono'

declare module 'hono' {
  interface Env {
    // biome-ignore lint/complexity/noBannedTypes: Empty Variables is intentional for module augmentation
    Variables: {}
    Bindings: {
      KV: KVNamespace
    }
  }
}

// biome-ignore lint/complexity/noBannedTypes: Empty type parameter is required by Hono's Context type
export type AppContext = import('hono').Context<import('hono').Env, string, {}>
