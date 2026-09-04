export type BlogPost = {
  slug: string
  title: string
  date: string // ISO 8601 (YYYY-MM-DD)
  description: string
  /** 検索エンジン／OGP用の説明（未指定ならdescriptionを使う） */
  seoDescription?: string
  icon: string
  /** ウィンドウ／アプリのステータスバーに出す一言 */
  statusNote: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'wablo',
    title: 'Wablo',
    date: '2026-08-28',
    description:
      '友だちに30秒の落書きを送るiOSアプリの話。テキストも写真もフィードもなし。へたな絵ほど、よく届きます。',
    seoDescription: '友だちに30秒の落書きを送るiOSアプリ「Wablo」の話。画面遷移を捨てて、大きな机をひとつ作りました。',
    icon: '🖍️',
    statusNote: 'UTF-8 ｜ Markdown ｜ 読了まで: 30秒ではたぶん無理',
  },
]

export function formatPostDate(date: string): string {
  return date.replaceAll('-', '.')
}

export function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
