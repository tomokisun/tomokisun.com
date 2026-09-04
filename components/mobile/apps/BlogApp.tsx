import Link from 'next/link'
import { blogArticles } from '@/components/blog/posts'
import { blogPosts, formatPostDate } from '@/data/blog-posts'

// ブログアプリ。いちらんと記事ペインを両方持ち、lib/sp/blog.ts が push/pop する
// （記事を読むためにアプリを出ない。戻るのは ‹ ボタンか左端スワイプ）。
export default function BlogApp() {
  return (
    <div className="sp-blog" data-sp-blog>
      <div className="sp-blog-pane sp-blog-list" data-sp-blog-pane="list">
        <div className="sp-products-list">
          {blogPosts.map((post) => (
            <button key={post.slug} type="button" className="sp-product-item" data-sp-blog-open={post.slug}>
              <span className="sp-product-icon tile-soda">{post.icon}</span>
              <div className="sp-product-info">
                <div className="sp-product-name">{post.title}</div>
                <div className="sp-product-desc">
                  {formatPostDate(post.date)} ｜ {post.description}
                </div>
              </div>
              <span className="sp-product-arrow">→</span>
            </button>
          ))}
        </div>
        <p className="blog-window-note">らくがきではなく、文章を書く日もあります。</p>
      </div>

      {blogPosts.map((post) => {
        const Article = blogArticles[post.slug]
        if (!Article) return null
        return (
          <article
            key={post.slug}
            className="sp-blog-pane sp-blog-post"
            data-sp-blog-pane={post.slug}
            aria-label={`${post.slug}.md`}
            hidden
          >
            <header className="sp-blog-nav">
              <button type="button" className="sp-app-back" data-sp-blog-back>
                ‹ いちらん
              </button>
              <span className="sp-blog-nav-title">{post.slug}.md</span>
            </header>
            <div className="sp-blog-post-body blog-doc">
              <Article variant="sp" />
              <nav className="blog-backlinks" aria-label="この記事のリンク">
                <Link className="os-button" href={`/blog/${post.slug}`}>
                  🔗 単体ページでひらく
                </Link>
              </nav>
              <p className="blog-window-note">ともだちに送るときは、こちらのURLをどうぞ。</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
