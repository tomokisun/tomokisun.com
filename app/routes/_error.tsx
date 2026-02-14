import type { ErrorHandler } from 'hono'
import ErrorPage from '../components/pages/ErrorPage'

const handler: ErrorHandler = (e, c) => {
  if ('getResponse' in e) {
    return e.getResponse()
  }
  const message = e instanceof Error ? e.message : String(e)
  console.error(message)
  c.status(500)
  return c.render(
    <ErrorPage
      code={500}
      title="INTERNAL SERVER ERROR"
      message="Sorry, something went wrong on our server."
      marqueeText="Please try again later 😢"
    />,
  )
}

export default handler
