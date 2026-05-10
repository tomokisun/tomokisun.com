import type { JSX } from 'hono/jsx/jsx-runtime'
import type { AppContext } from '../../global'
import { getVisitorsCount } from '../../utils/visitors'
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

export default async function PageLayout({ c, children, className = '' }: PageLayoutProps) {
  const visitorsCount = await getVisitorsCount(c)
  return (
    <div className={`container ${className}`}>
      <div className="layout-grid">
        <Menu />
        <Header visitorsCount={visitorsCount.padStart(4, '0')} />
        <div className="grid-marquee">
          <Marquee text="✿ ようこそ tomokisun のホムペへ ♡ 素通り禁止だヨ ✿" speed="normal" />
        </div>
        <main id="main-content" className="grid-content">
          <div className="content">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
