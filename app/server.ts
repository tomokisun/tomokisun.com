import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

const app = createApp()

app.use('*', async (c, next) => {
  await next()
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})

showRoutes(app)

export default app
