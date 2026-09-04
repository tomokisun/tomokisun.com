// SpotlightとSP検索の共通インデックス。アプリ・ブログ・プロダクトを1本の配列にする。

import { apps, CATEGORY_LABELS } from '@/data/apps'
import { blogPosts, formatPostDate } from '@/data/blog-posts'
import { products } from '@/data/products'

export type SearchHit = {
  /** 開くときの相手。app=アプリ、window=PCのウィンドウID、link=外部（別のマシン） */
  kind: 'app' | 'window' | 'link'
  id: string
  icon: string
  title: string
  subtitle: string
  haystack: string
}

let index: SearchHit[] | null = null

function build(): SearchHit[] {
  const hits: SearchHit[] = apps.map((app) => ({
    kind: 'app',
    id: app.id,
    icon: app.icon,
    title: app.name,
    subtitle: `${CATEGORY_LABELS[app.category]} ｜ ${app.subtitle}`,
    haystack: [app.id, app.name, app.windowTitle ?? '', app.subtitle, ...(app.keywords ?? [])].join(' ').toLowerCase(),
  }))

  for (const post of blogPosts) {
    hits.push({
      kind: 'window',
      id: `blog-${post.slug}`,
      icon: post.icon,
      title: post.title,
      subtitle: `ブログ ｜ ${formatPostDate(post.date)}`,
      haystack: [post.slug, post.title, post.description].join(' ').toLowerCase(),
    })
  }

  for (const product of products) {
    hits.push({
      kind: 'window',
      id: `p-${product.id}`,
      icon: product.icon,
      title: `${product.title}.app`,
      subtitle: product.acquiredBy ? `Products ｜ 買収済（${product.acquiredBy}）` : 'Products',
      haystack: [product.id, product.title, product.description].join(' ').toLowerCase(),
    })
  }

  return hits
}

export function search(query: string, limit = 8): SearchHit[] {
  index ??= build()
  const q = query.trim().toLowerCase()
  if (!q) return index.slice(0, limit)
  const starts: SearchHit[] = []
  const contains: SearchHit[] = []
  for (const hit of index) {
    if (hit.title.toLowerCase().startsWith(q)) starts.push(hit)
    else if (hit.haystack.includes(q)) contains.push(hit)
  }
  return [...starts, ...contains].slice(0, limit)
}
