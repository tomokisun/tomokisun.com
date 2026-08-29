import Link from 'next/link'
import { blogPosts, formatPostDate } from '@/data/blog-posts'

export default function BlogApp() {
  return (
    <div className="sp-products-list">
      {blogPosts.map((post) => (
        <Link key={post.slug} className="sp-product-item" href={`/blog/${post.slug}`}>
          <span className="sp-product-icon tile-soda">{post.icon}</span>
          <div className="sp-product-info">
            <div className="sp-product-name">{post.title}</div>
            <div className="sp-product-desc">
              {formatPostDate(post.date)} ｜ {post.description}
            </div>
          </div>
          <span className="sp-product-arrow">→</span>
        </Link>
      ))}
    </div>
  )
}
