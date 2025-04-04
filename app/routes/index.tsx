import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'

export default createRoute(async (c) => {
  return c.render(<HomePage c={c} />)
})
