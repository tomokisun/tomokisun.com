import { createRoute } from 'honox/factory'
import AccountsPage from '../components/pages/AccountsPage'

export default createRoute(async (c) => {
  return c.render(<AccountsPage c={c} />)
})
