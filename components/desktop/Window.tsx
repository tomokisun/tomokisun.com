import type { CSSProperties, ReactNode } from 'react'
import type { OsColor, WindowGeometry } from '@/data/apps'

export type WindowColor = OsColor

type WindowProps = {
  id: string
  title: string
  color?: WindowColor
  open?: boolean
  statusBar?: string
  /** 初期位置。data/apps.ts の geometry から渡す（未指定ならCSSの既定位置） */
  geometry?: WindowGeometry
  children: ReactNode
}

export default function Window({
  id,
  title,
  color = 'cream',
  open = false,
  statusBar,
  geometry,
  children,
}: WindowProps) {
  const style = geometry
    ? ({
        '--win-top': `${geometry.top}px`,
        '--win-left': `${geometry.left}px`,
        '--win-width': `${geometry.width}px`,
        ...(geometry.height ? { '--win-height': `${geometry.height}px` } : {}),
      } as CSSProperties)
    : undefined

  return (
    <section
      id={`win-${id}`}
      className={`os-window${open ? ' is-open' : ''}`}
      data-window={id}
      aria-label={title}
      style={style}
    >
      <header className={`os-titlebar tb-${color}`} data-drag-handle>
        <div className="os-traffic-lights">
          <button
            type="button"
            className="os-traffic-light os-traffic-light--close"
            data-close
            aria-label={`「${title}」を閉じる`}
          />
          <button
            type="button"
            className="os-traffic-light os-traffic-light--min"
            data-minimize
            aria-label={`「${title}」をしまう`}
          />
          <button
            type="button"
            className="os-traffic-light os-traffic-light--max"
            data-zoom
            aria-label={`「${title}」を拡大`}
          />
        </div>
        <h2 className="os-title">{title}</h2>
      </header>
      <div className="os-window-body">{children}</div>
      {statusBar && <footer className="os-statusbar">{statusBar}</footer>}
      <span className="os-resize" data-resize aria-hidden="true" />
    </section>
  )
}
