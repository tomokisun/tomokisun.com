import type { NotFoundHandler } from 'hono'
import ErrorPage from '../components/pages/ErrorPage'

const handler: NotFoundHandler = (c) => {
  c.status(404)
  return c.render(
    <ErrorPage
      code={404}
      title="FILE NOT FOUND"
      message="そのようなファイルやフォルダはありません。ゴミ箱の中も探しましたが、infra.zipしかありませんでした。"
    />,
  )
}

export default handler
