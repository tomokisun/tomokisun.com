// アプリ本体の共通パーツ（app kit）。
// PCのウィンドウとSPのアプリ画面は同じ本体を包むだけなので、見た目はここ1箇所に集約する。
// クラス名はすべて `ak-` 始まり。スタイルは app/globals.css の「アプリ共通パーツ」節。

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { OsColor } from '@/data/apps'

export function AppDoc({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`ak${className ? ` ${className}` : ''}`}>{children}</div>
}

export function AppHero({
  icon,
  title,
  sub,
  color = 'cream',
}: {
  icon: string
  title: string
  sub?: string
  color?: OsColor
}) {
  return (
    <div className="ak-hero">
      <span className={`ak-hero-icon tile-${color}`} aria-hidden="true">
        {icon}
      </span>
      <span className="ak-hero-text">
        <span className="ak-hero-title">{title}</span>
        {sub && <span className="ak-hero-sub">{sub}</span>}
      </span>
    </div>
  )
}

export function Section({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="ak-section">
      {(title || action) && (
        <header className="ak-section-head">
          {title && <h3 className="ak-section-title">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Rows({ children }: { children: ReactNode }) {
  return <div className="ak-rows">{children}</div>
}

export function Row({ label, value, hint }: { label: ReactNode; value?: ReactNode; hint?: string }) {
  return (
    <div className="ak-row">
      <span className="ak-row-label">{label}</span>
      <span className="ak-row-value">
        {value}
        {hint && <em className="ak-row-hint">{hint}</em>}
      </span>
    </div>
  )
}

type ListRowProps = {
  icon?: string
  color?: OsColor
  title: ReactNode
  desc?: ReactNode
  meta?: ReactNode
  arrow?: boolean
  /** 押せる行にする（data-open / data-sp-open / data-quip 等をそのまま渡せる） */
  action?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'>

export function List({ children }: { children: ReactNode }) {
  return <div className="ak-list">{children}</div>
}

export function ListRow({ icon, color = 'cream', title, desc, meta, arrow, action, ...rest }: ListRowProps) {
  const inner = (
    <>
      {icon && (
        <span className={`ak-list-icon tile-${color}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ak-list-text">
        <span className="ak-list-title">{title}</span>
        {desc && <span className="ak-list-desc">{desc}</span>}
      </span>
      {meta && <span className="ak-list-meta">{meta}</span>}
      {arrow && (
        <span className="ak-list-arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  )
  if (action) {
    return (
      <button type="button" className="ak-list-row ak-list-row--action" {...rest}>
        {inner}
      </button>
    )
  }
  return <div className="ak-list-row">{inner}</div>
}

export function Grid({ cols = 3, children }: { cols?: number; children: ReactNode }) {
  return (
    <div className="ak-grid" style={{ '--ak-cols': cols } as React.CSSProperties}>
      {children}
    </div>
  )
}

export function Tile({
  icon,
  label,
  sub,
  color = 'cream',
  ...rest
}: { icon: string; label: ReactNode; sub?: ReactNode; color?: OsColor } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="ak-tile" {...rest}>
      <span className={`ak-tile-icon tile-${color}`} aria-hidden="true">
        {icon}
      </span>
      <span className="ak-tile-label">{label}</span>
      {sub && <span className="ak-tile-sub">{sub}</span>}
    </button>
  )
}

/** 小ネタ行。どのアプリにも1つは置くこと */
export function Note({ children }: { children: ReactNode }) {
  return <p className="ak-note">{children}</p>
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="ak-toolbar">{children}</div>
}

/**
 * 押すと一言だけ返すボタン。lib/apps/quip.ts が [data-quip] を拾ってトーストを出す。
 * 「ボタンはあるが、押しても何も起きない」を避けるための共通装置。
 */
export function Quip({ label, quip, danger }: { label: ReactNode; quip: string; danger?: boolean }) {
  return (
    <button type="button" className={`os-button${danger ? ' os-button--danger' : ''}`} data-quip={quip}>
      {label}
    </button>
  )
}

export function Meter({
  label,
  value,
  max = 100,
  color = 'melon',
}: {
  label: ReactNode
  value: number
  max?: number
  color?: OsColor
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="ak-meter">
      <span className="ak-meter-label">{label}</span>
      <span className="ak-meter-track">
        <span className={`ak-meter-fill tile-${color}`} style={{ width: `${pct}%` }} />
      </span>
    </div>
  )
}

/** 折れ線。株価・アクティビティモニタ・ヘルスケアで使い回す */
export function Sparkline({
  points,
  color = 'melon',
  height = 44,
  className,
  ...rest
}: { points: number[]; color?: OsColor; height?: number; className?: string } & Record<string, unknown>) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const step = 100 / (points.length - 1 || 1)
  const d = points.map((p, i) => `${i * step},${34 - ((p - min) / span) * 30}`).join(' ')
  return (
    <svg
      className={`ak-spark ak-spark--${color}${className ? ` ${className}` : ''}`}
      viewBox="0 0 100 36"
      preserveAspectRatio="none"
      style={{ height }}
      aria-hidden="true"
      {...rest}
    >
      <polyline points={d} />
    </svg>
  )
}

/** アクティビティリング（ヘルスケア・フィットネス） */
export function Rings({ move, exercise, stand }: { move: number; exercise: number; stand: number }) {
  const ring = (r: number, value: number, cls: string) => {
    const c = 2 * Math.PI * r
    return (
      <>
        <circle className="ak-ring-track" cx="60" cy="60" r={r} />
        <circle
          className={`ak-ring-fill ${cls}`}
          cx="60"
          cy="60"
          r={r}
          strokeDasharray={`${(c * Math.min(value, 100)) / 100} ${c}`}
        />
      </>
    )
  }
  return (
    <svg
      className="ak-rings"
      viewBox="0 0 120 120"
      role="img"
      aria-label={`ムーブ${move}%・エクササイズ${exercise}%・スタンド${stand}%`}
    >
      {ring(50, move, 'is-move')}
      {ring(38, exercise, 'is-exercise')}
      {ring(26, stand, 'is-stand')}
    </svg>
  )
}

export function Chips({ children }: { children: ReactNode }) {
  return <div className="ak-chips">{children}</div>
}

export function Chip({ children, tone }: { children: ReactNode; tone?: OsColor }) {
  return <span className={`ak-chip${tone ? ` tile-${tone}` : ''}`}>{children}</span>
}

/**
 * タブ（セグメンテッドコントロール）。lib/apps/segmented.ts が配線する。
 * `name` はアプリ内で一意ならよい（PC/SPの両方のDOMに同じものが出るため、IDには使わない）。
 */
export function Segmented({ name, tabs }: { name: string; tabs: { value: string; label: string }[] }) {
  return (
    <div className="ak-seg" role="tablist" data-seg={name}>
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          className="ak-seg-tab"
          data-seg-tab={tab.value}
          aria-selected={i === 0}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function SegPane({ name, value, children }: { name: string; value: string; children: ReactNode }) {
  return (
    <div className="ak-seg-pane" data-seg-pane={`${name}:${value}`} role="tabpanel">
      {children}
    </div>
  )
}

/** メッセージアプリの吹き出し（他のアプリの会話演出でも使う） */
export function Bubble({ from, children }: { from: 'me' | 'them'; children: ReactNode }) {
  return <div className={`ak-bubble ak-bubble--${from}`}>{children}</div>
}

/** 端末画面のような黒地の箱（Xcodeのログ・スクリプトエディタ等） */
export function Console({ lines }: { lines: string[] }) {
  return (
    <pre className="ak-console">
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 静的な行の並びなので順序は不変
        <div key={i}>{line || ' '}</div>
      ))}
    </pre>
  )
}

/**
 * アプリの本体はOSの中に1つだけ存在し、PCのウィンドウとSPのアプリ画面のあいだを引っ越す
 * （lib/os/adopt.ts）。したがって本体は「いまどちらの画面か」を知らなくてよい。
 * 画面ごとに言い回しを変えたいときだけ .pc-only / .sp-only を使う。
 */
export type AppBodyProps = { platform: 'pc' | 'sp' }

/**
 * 別のアプリを開くための属性。PCはウィンドウを、SPはアプリ画面を開く（解釈は各OSの担当）。
 * アプリ同士の行き来はすべてこれを通す＝OSの外には出ない。
 */
export function opens(id: string): Record<string, string> {
  return { 'data-app-open': id }
}
