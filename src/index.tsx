import { Hono } from 'hono';
import { renderer } from './renderer';
import { Home } from './pages';

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<Home />)
})

export default app
