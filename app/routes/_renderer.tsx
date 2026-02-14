import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

const SITE_NAME = "tomokisun's homepage"
const SITE_URL = 'https://tomokisun.com'
const DEFAULT_DESCRIPTION =
  "Welcome to tomokisun's personal homepage! Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0."
const OGP_IMAGE = `${SITE_URL}/ogp.png`

const safeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, '\\u003c')

const defaultJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  author: {
    '@type': 'Person',
    name: 'tomokisun',
    jobTitle: 'Software Engineer',
    url: SITE_URL,
  },
  description: DEFAULT_DESCRIPTION,
}

export default jsxRenderer(({ children, title, description, ogUrl, jsonLd }) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const pageDescription = description ?? DEFAULT_DESCRIPTION
  const canonicalUrl = ogUrl ?? SITE_URL

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="theme-color" content="#000080" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="tomokisun, personal, homepage, web, mobile, iOS, engineer, 90s, retro" />
        <meta name="author" content="tomokisun" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={OGP_IMAGE} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tomokisun" />
        <meta name="twitter:creator" content="@tomokisun" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OGP_IMAGE} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(defaultJsonLd) }}
        />
        {jsonLd && (
          <script type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
          />
        )}
      </head>
      <body>
        <a href="#main-content" class="skip-to-content">
          メインコンテンツへスキップ
        </a>
        {children}
        <div class="crt-overlay"></div>
      </body>
    </html>
  )
})
