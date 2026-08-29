import Link from 'next/link'
import type { ReactNode } from 'react'
import type { WindowColor } from '@/components/desktop/Window'

type BlogShellProps = {
  title: string
  color?: WindowColor
  statusBar: string
  children: ReactNode
}

// ブログ用ページchrome。デスクトップと同じ壁紙の上に、静的なウィンドウを1枚だけ置く。
// PC/SPどちらの幅でも表示される（os-desktop-shell / sp-shell の出し分けの外側にある）。
export default function BlogShell({ title, color = 'soda', statusBar, children }: BlogShellProps) {
  return (
    <div className="blog-root">
      <header className="os-menubar">
        <div className="os-menubar-left">
          <Link className="os-logo" href="/">
            🍈 tomokiOS
          </Link>
          <Link className="os-mb-item" href="/blog">
            ブログ
          </Link>
        </div>
        <div className="os-menubar-right">
          <span className="os-users">
            <span className="os-users-dot" aria-hidden="true" />
            閲覧モード
          </span>
          <span className="os-battery" title="読書中は省電力です">
            🔋64%
          </span>
        </div>
      </header>
      <main id="main-content" className="blog-main">
        <section className="blog-window" aria-label={title}>
          <header className={`os-titlebar tb-${color}`}>
            <div className="os-traffic-lights">
              <Link
                href="/"
                className="os-traffic-light os-traffic-light--close"
                aria-label="閉じてデスクトップに戻る"
              />
              <span className="os-traffic-light os-traffic-light--min" aria-hidden="true" />
              <span className="os-traffic-light os-traffic-light--max" aria-hidden="true" />
            </div>
            <span className="os-title">{title}</span>
          </header>
          <div className="blog-window-body">{children}</div>
          <footer className="os-statusbar">{statusBar}</footer>
        </section>
      </main>
    </div>
  )
}
