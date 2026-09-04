import { blogPosts, formatPostDate } from '@/data/blog-posts'
import Window from '../Window'

export default function BlogWindow() {
  return (
    <Window id="blog" title="📰 ブログ" color="soda" statusBar={`${blogPosts.length} 件の記事 ｜ RSS: まだありません`}>
      <ul className="blog-list">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <div>
              {/* 記事はサイトを離れずに別ウィンドウで開く（共有用のURLは記事ウィンドウの下にある） */}
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
