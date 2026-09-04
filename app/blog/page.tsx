import type { Metadata } from 'next'
import OsPage from '@/components/OsPage'

const TITLE = 'ブログ'
const DESCRIPTION = 'tomokisunのブログ。作ったものの話と、作りながら考えたことを、ゆっくり書いていきます。'
const URL = 'https://tomokisun.com/blog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${TITLE} | tomokiOS 26`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'tomokiOS 26',
    title: TITLE,
    type: 'website',
    images: '/ogp.png',
    url: URL,
    description: DESCRIPTION,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tomokisun',
    creator: '@tomokisun',
    title: TITLE,
    description: DESCRIPTION,
    images: '/ogp.png',
  },
}

// 独立したブログページは存在しない。このURLは「OSを起動してブログアプリを開く」ためのリンク。
export default function BlogIndexPage() {
  return <OsPage heading="tomokisunのブログ — tomokiOS 26" deepLink={{ app: 'blog' }} />
}
