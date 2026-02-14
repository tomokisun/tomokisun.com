import type { NotFoundHandler } from 'hono'
import ErrorPage from '../components/pages/ErrorPage'

const handler: NotFoundHandler = (c) => {
  c.status(404)
  return c.render(
    <ErrorPage
      code={404}
      title="PAGE NOT FOUND"
      message="The page you are looking for doesn't exist or has been moved."
      marqueeText="Where did that page go? 🤔"
    />,
  )
}

export default handler
