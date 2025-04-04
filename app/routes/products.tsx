import { createRoute } from 'honox/factory'
import ProductsPage from '../components/pages/ProductsPage'

export default createRoute(async (c) => {
  return c.render(<ProductsPage c={c} />)
})
