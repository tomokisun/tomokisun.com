import { blogArticles } from '@/components/blog/posts'
import { blogPosts } from '@/data/blog-posts'
import type { DeepLink } from '@/lib/deeplink'
import { openWindowIds } from '@/lib/deeplink'
import Window from '../Window'

// 記事ごとのウィンドウ。ブログのウィンドウから data-open で開く。
// 記事はOSの中だけで読む（「単体ページ」は存在しない。共有URLもこのウィンドウを開くだけ）。
export default function BlogPostWindows({ deepLink }: { deepLink?: DeepLink }) {
  const opened = openWindowIds(deepLink)
  return (
    <>
      {blogPosts.map((post) => {
        const Article = blogArticles[post.slug]
        if (!Article) return null
        const id = `blog-${post.slug}`
        return (
          <Window
            key={post.slug}
            id={id}
            title={`${post.slug}.md`}
            color="cream"
            statusBar={post.statusNote}
            open={opened.includes(id)}
          >
            <div className="blog-doc">
              <Article variant="pc" />
              <p className="blog-window-note">
                ともだちに送るときは、アドレスバーの tomokisun.com/blog/{post.slug}{' '}
                をどうぞ。ひらくと、このウィンドウがそのまま開きます。
              </p>
            </div>
          </Window>
        )
      })}
    </>
  )
}
