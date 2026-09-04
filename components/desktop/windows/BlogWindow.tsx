import { blogPosts, formatPostDate } from '@/data/blog-posts'
import Window from '../Window'

export default function BlogWindow({ open = false }: { open?: boolean }) {
  return (
    <Window
      id="blog"
      title="📰 ブログ"
      color="soda"
      open={open}
      statusBar={`${blogPosts.length} 件の記事 ｜ RSS: まだありません`}
    >
      <ul className="blog-list">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <div>
              {/* 記事はサイトを離れずに別ウィンドウで開く（OSの外にページは無い） */}
              <a href={`#win-blog-${post.slug}`} data-open={`blog-${post.slug}`}>
                {post.title}
              </a>
              <div className="blog-list-desc">{post.description}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="blog-window-note">らくがきではなく、文章を書く日もあります。</p>
    </Window>
  )
}
