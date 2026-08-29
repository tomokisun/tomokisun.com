import type { ReactNode } from 'react'

type AppViewProps = {
  id: string
  title: string
  color: string
  children: ReactNode
}

export default function AppView({ id, title, color, children }: AppViewProps) {
  return (
    <div className="sp-app-view" data-app={id} role="dialog" aria-modal="true" aria-label={title}>
      <header className={`sp-app-header tb-${color}`}>
        <button type="button" className="sp-app-back" data-sp-close>
          ◀ ホーム
        </button>
        <h2 className="sp-app-title">{title}</h2>
      </header>
      <div className="sp-app-body">{children}</div>
      <button type="button" className="sp-gesture-bar" data-sp-close aria-label="ホームへもどる">
        <span className="sp-gesture-bar-pill" aria-hidden="true" />
      </button>
    </div>
  )
}
