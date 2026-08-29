import type { Metadata } from 'next'
import Link from 'next/link'
import BlogShell from '@/components/blog/BlogShell'
import { blogPosts, formatPostDate } from '@/data/blog-posts'

const TITLE = 'ブログ'
const DESCRIPTION = 'tomokisunのブログ。作ったものの話と、作りながら考えたことを、ゆっくり書いていきます。'
const URL = 'https://tomokisun.com/blog'

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

export default function BlogIndexPage() {
  return (
    <BlogShell
      title="📰 ブログ"
      statusBar={`${blogPosts.length} 件の記事 ｜ 更新頻度: のんびり ｜ RSS: まだありません`}
    >
      <h1 className="blog-title">ブログ</h1>
      <p className="blog-lead">
        tomokisunです。ふだんは友人と共同創業した ONE, Inc.
        で働きつつ、個人でもアプリを作っています。作ったものの話と、作りながら考えたことを、ここにゆっくり書いていきます。
      </p>
      <ul className="blog-list">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <div>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <div className="blog-list-desc">{post.description}</div>
            </div>
          </li>
        ))}
      </ul>
      <nav className="blog-backlinks" aria-label="ページ移動">
        <Link className="os-button" href="/">
          🍈 デスクトップに戻る
        </Link>
      </nav>
    </BlogShell>
  )
}
