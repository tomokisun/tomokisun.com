import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OsPage from '@/components/OsPage'
import { blogPosts, findPost } from '@/data/blog-posts'

type Params = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return {}

  const url = `https://tomokisun.com/blog/${post.slug}`
  const description = post.seoDescription ?? post.description

  return {
    title: `${post.title} | tomokiOS 26 ブログ`,
    description,
    alternates: { canonical: url },
    openGraph: {
      siteName: 'tomokiOS 26',
      title: post.title,
      type: 'article',
      publishedTime: post.date,
      authors: ['tomokisun'],
      images: '/ogp.png',
      url,
      description,
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@tomokisun',
      creator: '@tomokisun',
      title: post.title,
      description,
      images: '/ogp.png',
    },
  }
}

// 記事も「単体ページ」にはしない。このURLはブログアプリをその記事で開くためのリンク。
export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  const url = `https://tomokisun.com/blog/${post.slug}`

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires raw script injection
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.seoDescription ?? post.description,
            datePublished: post.date,
            url,
            mainEntityOfPage: url,
            author: { '@type': 'Person', name: 'tomokisun', url: 'https://tomokisun.com' },
          }),
        }}
      />
      <OsPage heading={`${post.title} — tomokiOS 26 ブログ`} deepLink={{ app: 'blog', item: post.slug }} />
    </>
  )
}
