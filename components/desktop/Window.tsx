import type { ReactNode } from 'react'

export type WindowColor = 'cherry' | 'melon' | 'soda' | 'cream' | 'lavender' | 'dark'

type WindowProps = {
  id: string
  title: string
  color?: WindowColor
  open?: boolean
  statusBar?: string
  children: ReactNode
}

export default function Window({ id, title, color = 'cream', open = false, statusBar, children }: WindowProps) {
  return (
    <section id={`win-${id}`} className={`os-window${open ? ' is-open' : ''}`} data-window={id} aria-label={title}>
      <header className={`os-titlebar tb-${color}`} data-drag-handle>
        <div className="os-traffic-lights">
          <button
            type="button"
            className="os-traffic-light os-traffic-light--close"
            data-close
            aria-label={`「${title}」を閉じる`}
          />
          <span className="os-traffic-light os-traffic-light--min" aria-hidden="true" />
          <span className="os-traffic-light os-traffic-light--max" aria-hidden="true" />
        </div>
        <h2 className="os-title">{title}</h2>
      </header>
      <div className="os-window-body">{children}</div>
      {statusBar && <footer className="os-statusbar">{statusBar}</footer>}
    </section>
  )
}
