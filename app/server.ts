import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { createApp } from 'honox/server'
import api from './api';

const app = createApp()

app.use(logger());

app.route('/api', api);

showRoutes(app)

export default app
