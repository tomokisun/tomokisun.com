import Link from 'next/link'
import { blogArticles } from '@/components/blog/posts'
import { blogPosts } from '@/data/blog-posts'
import Window from '../Window'

// 記事ごとのウィンドウ。ブログのウィンドウから data-open で開く（デスクトップから離脱しない）。
export default function BlogPostWindows() {
  return (
    <>
      {blogPosts.map((post) => {
        const Article = blogArticles[post.slug]
        if (!Article) return null
        return (
          <Window
            key={post.slug}
            id={`blog-${post.slug}`}
            title={`${post.slug}.md`}
            color="cream"
            statusBar={post.statusNote}
          >
            <div className="blog-doc">
              <Article variant="pc" />
              <nav className="blog-backlinks" aria-label="この記事のリンク">
                <Link className="os-button" href={`/blog/${post.slug}`}>
                  🔗 単体ページでひらく
                </Link>
              </nav>
              <p className="blog-window-note">ともだちに送るときは、こちらのURLをどうぞ。</p>
            </div>
          </Window>
        )
      })}
    </>
  )
}
