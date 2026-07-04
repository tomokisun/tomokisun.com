import type { Metadata, Viewport } from 'next'
import { DotGothic16 } from 'next/font/google'
import './globals.css'

const dotGothic = DotGothic16({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-dot-gothic' })

const SITE_NAME = 'tomokiOS 26'
const SITE_URL = 'https://tomokisun.com'
const DESCRIPTION =
  'tomokisunのホームページ、あらため tomokiOS 26 "Cream Soda"。ウィンドウを開いて、ご自由にお使いください。メモリは640KBあれば十分なはず。'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: DESCRIPTION,
  keywords: 'tomokisun, personal, homepage, web, mobile, iOS, engineer, tomokiOS, desktop',
  authors: [{ name: 'tomokisun' }],
  robots: 'index, follow',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: 'website',
    images: '/ogp.png',
    url: SITE_URL,
    description: DESCRIPTION,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tomokisun',
    creator: '@tomokisun',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: '/ogp.png',
  },
  alternates: { canonical: SITE_URL },
  other: {
    'theme-color': '#a7dbe8',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={dotGothic.variable}>
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires raw script injection
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              description: DESCRIPTION,
            }),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires raw script injection
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'tomokisun',
              jobTitle: 'Software Engineer',
              url: SITE_URL,
              sameAs: [
                'https://facebook.com/tomokisun',
                'https://linkedin.com/in/tomokisun',
                'https://instagram.com/tomokisun',
                'https://twitter.com/tomokisun',
                'https://t.me/tomokisun',
                'https://web.zepeto.me/tomokisun',
                'https://github.com/tomokisun',
              ],
              worksFor: { '@type': 'Organization', name: 'ONE, Inc.' },
            }),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          メインコンテンツへスキップ
        </a>
        {children}
      </body>
    </html>
  )
}
