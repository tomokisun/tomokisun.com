import type { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog-posts'

const SITE_URL = 'https://tomokisun.com'

// URLはどれも「OSを起動して、そのアプリを開く」ためのもの。ページの数＝アプリの入口の数。
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'monthly', priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
