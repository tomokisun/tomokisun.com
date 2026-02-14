import type { JSX } from 'hono/jsx/jsx-runtime'
import type { AppContext } from '../../global'
import Marquee from '../atoms/Marquee'
import Footer from '../organisms/Footer'
import Header from '../organisms/Header'
import Menu from '../organisms/Menu'

type PageLayoutProps = {
  c: AppContext
  title: string
  children: JSX.Element | JSX.Element[]
  className?: string
}

export default function PageLayout({ c, title, children, className = '' }: PageLayoutProps) {
  return (
    <div className={`container ${className}`}>
      <div className="layout-grid">
        <Header title={title} />
        <div className="grid-marquee">
          <Marquee text="最新情報: サイトをリニューアルしました！ 新機能続々追加中！ お楽しみに！" speed="normal" />
        </div>
        <Menu c={c} />
        <main className="grid-content">
          <div className="content">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
