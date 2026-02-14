import type {} from 'hono'

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      KV: KVNamespace,
    }
  }
}

export type AppContext = import('hono').Context<import('hono').Env, any, {}>
