import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <title>tomokisun's homepage</title>
        <meta name="description" content="Welcome to tomokisun's personal homepage! Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0." />
        <meta name="keywords" content="tomokisun, personal, homepage, web, mobile, iOS, engineer, 90s, retro" />
        <meta name="author" content="tomokisun" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="tomokisun's homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/ogp.png" />
        <meta property="og:url" content="https://tomokisun.com" />
        <meta property="og:description" content="Welcome to tomokisun's personal homepage! Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0." />
        <meta property='twitter:card' content='summary_large_image' />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
})
