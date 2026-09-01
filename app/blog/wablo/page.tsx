import type { Metadata } from 'next'
import Link from 'next/link'
import BlogShell from '@/components/blog/BlogShell'
import WabloArticle from '@/components/blog/posts/wablo'
import { blogPosts } from '@/data/blog-posts'

const TITLE = 'Wablo'
const DESCRIPTION = '友だちに30秒の落書きを送るiOSアプリ「Wablo」の話。画面遷移を捨てて、大きな机をひとつ作りました。'
const URL = 'https://tomokisun.com/blog/wablo'
const PUBLISHED = '2026-08-28'
const STATUS_BAR = blogPosts.find((post) => post.slug === 'wablo')?.statusNote ?? 'UTF-8 ｜ Markdown'

export const metadata: Metadata = {
  title: `${TITLE} | tomokiOS 26 ブログ`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'tomokiOS 26',
    title: TITLE,
    type: 'article',
    publishedTime: PUBLISHED,
    authors: ['tomokisun'],
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

export default function WabloPostPage() {
  return (
    <BlogShell title="wablo.md" statusBar={STATUS_BAR}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires raw script injection
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            url: URL,
            mainEntityOfPage: URL,
            author: {
              '@type': 'Person',
              name: 'tomokisun',
              url: 'https://tomokisun.com',
            },
          }),
        }}
      />
      <WabloArticle variant="page" />
      <nav className="blog-backlinks" aria-label="ページ移動">
        <Link className="os-button" href="/blog">
          ◀ 記事いちらん
        </Link>
        <Link className="os-button" href="/">
          🍈 デスクトップに戻る
        </Link>
      </nav>
    </BlogShell>
  )
}
