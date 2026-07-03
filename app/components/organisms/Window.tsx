import type { JSX } from 'hono/jsx/jsx-runtime'

export type WindowColor = 'yellow' | 'pink' | 'mint' | 'blue' | 'lavender'

type WindowProps = {
  id: string
  title: string
  color?: WindowColor
  open?: boolean
  statusBar?: string | JSX.Element
  children: JSX.Element | JSX.Element[]
}

export default function Window({ id, title, color = 'yellow', open = false, statusBar, children }: WindowProps) {
  return (
    <section id={`win-${id}`} className={`os-window ${open ? 'is-open' : ''}`} data-window={id} aria-label={title}>
      <header className={`os-titlebar tb-${color}`} data-drag-handle>
        <button type="button" className="os-close" data-close aria-label={`「${title}」を閉じる`}></button>
        <h2 className="os-title">{title}</h2>
        <span className="os-titlebar-stripes" aria-hidden="true"></span>
      </header>
      <div className="os-window-body">{children}</div>
      {statusBar && <footer className="os-statusbar">{statusBar}</footer>}
    </section>
  )
}
