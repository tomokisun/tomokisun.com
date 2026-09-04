import type { ReactNode } from 'react'

/**
 * 記事本文の描画先。pc=デスクトップのウィンドウ / sp=スマホのアプリ
 * 「OSの外のページ」は存在しないので、この2つしかない。
 */
export type BlogVariant = 'pc' | 'sp'

export type BlogArticleProps = { variant: BlogVariant }

/** `/` ではPC版とSP版のDOMが同時に存在するので、脚注のidは描画先ごとに分ける */
export function anchorId(variant: BlogVariant, id: string): string {
  return `${variant}-${id}`
}

/** 記事はページのh1（sr-only）の下にぶら下がるので、見出しは1段下げる */
export const titleLevel = (): 2 => 2
export const sectionLevel = (): 3 => 3

type HeadingProps = { level: 1 | 2 | 3; className?: string; children: ReactNode }

export function Heading({ level, className, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  return <Tag className={className}>{children}</Tag>
}

/** 本文から脚注へ */
export function FootnoteRef({ variant, n }: BlogArticleProps & { n: number }) {
  return (
    <sup id={anchorId(variant, `ref-${n}`)}>
      <a href={`#${anchorId(variant, `fn-${n}`)}`}>{n}</a>
    </sup>
  )
}

/** 脚注から本文へ */
export function FootnoteBack({ variant, n }: BlogArticleProps & { n: number }) {
  return (
    <a href={`#${anchorId(variant, `ref-${n}`)}`} aria-label="本文に戻る">
      ↩
    </a>
  )
}

/** ゴミ箱への導線。読書を中断させず、その場でゴミ箱アプリを開く */
export function TrashLink({ variant }: BlogArticleProps) {
  if (variant === 'pc') {
    return (
      <a href="#win-trash" data-open="trash">
        デスクトップのゴミ箱
      </a>
    )
  }
  return (
    <button type="button" className="blog-inline-open" data-sp-open="trash">
      ゴミ箱アプリ
    </button>
  )
}
