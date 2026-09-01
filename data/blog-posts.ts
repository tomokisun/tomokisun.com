export type BlogPost = {
  slug: string
  title: string
  date: string // ISO 8601 (YYYY-MM-DD)
  description: string
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
    icon: '🖍️',
    statusNote: 'UTF-8 ｜ Markdown ｜ 読了まで: 30秒ではたぶん無理',
  },
]

export function formatPostDate(date: string): string {
  return date.replaceAll('-', '.')
}
