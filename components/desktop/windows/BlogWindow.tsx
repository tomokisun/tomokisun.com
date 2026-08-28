import Link from 'next/link'
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
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <div className="blog-list-desc">{post.description}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="blog-window-note">らくがきではなく、文章を書く日もあります。</p>
    </Window>
  )
}
