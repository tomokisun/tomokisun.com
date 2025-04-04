import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { createApp } from 'honox/server'
import apiRoute from './api/api-route';

const app = createApp()

app.use(logger());

app.route('/api', apiRoute);

showRoutes(app)

export default app
