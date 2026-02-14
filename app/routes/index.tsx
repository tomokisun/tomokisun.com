import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);

  return c.render(
    <HomePage
      c={c}
    />
  )
})
