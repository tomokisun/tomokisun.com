import type {} from 'hono'

type Head = {
  title?: string
  description?: string
  ogUrl?: string
  jsonLd?: object
}

declare module 'hono' {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: interface required for module augmentation (declaration merging)
    (content: string | Promise<string>, head?: Head): Response | Promise<Response>
  }
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
