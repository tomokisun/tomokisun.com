import { blogPosts, formatPostDate } from '@/data/blog-posts'

// 通知センター（メニューバーの🔔から）。ウィジェットを縦に並べただけの1枚。
export default function NotificationCenter({ visitorsCount }: { visitorsCount: string }) {
  const post = blogPosts[0]
  return (
    <aside className="os-nc" data-notification-center hidden aria-label="通知センター">
      <div className="os-nc-widget tile-soda">
        <span className="os-nc-widget-title">天気</span>
        <span className="os-nc-widget-main">24° 晴れ</span>
        <span className="os-nc-widget-sub">机の上 ｜ 降水確率 0%</span>
      </div>
      <div className="os-nc-widget tile-cream">
        <span className="os-nc-widget-title">今日</span>
        <span className="os-nc-widget-main" data-nc-date>
          --月--日
        </span>
        <span className="os-nc-widget-sub">予定: 開発</span>
      </div>
      <div className="os-nc-widget tile-cherry">
        <span className="os-nc-widget-title">ログイン中</span>
        <span className="os-nc-widget-main">{visitorsCount}人</span>
        <span className="os-nc-widget-sub">素通り禁止です</span>
      </div>
      {post && (
        <button type="button" className="os-nc-note" data-open={`blog-${post.slug}`}>
          <span className="os-nc-note-app">ブログ ｜ {formatPostDate(post.date)}</span>
          <span className="os-nc-note-title">{post.title}</span>
          <span className="os-nc-note-body">{post.description}</span>
        </button>
      )}
      <button type="button" className="os-nc-note" data-open="trash">
        <span className="os-nc-note-app">ストレージ ｜ たったいま</span>
        <span className="os-nc-note-title">のこり1KBです</span>
        <span className="os-nc-note-body">640KBのうち639KBを使用中。infra.zip が 3.2GB あるのは見なかったことに。</span>
      </button>
    </aside>
  )
}
