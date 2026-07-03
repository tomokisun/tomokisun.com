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
      title="KERNEL PANIC"
      message="tomokiOSの内部でエラーが発生しました。カーネル（HonoX）は無事です。"
    />,
  )
}

export default handler
