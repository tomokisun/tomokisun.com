import Link from 'next/link'
import type { ReactNode } from 'react'

/** 記事本文の描画先。page=独立ページ / pc=デスクトップのウィンドウ / sp=スマホのアプリ */
export type BlogVariant = 'page' | 'pc' | 'sp'

export type BlogArticleProps = { variant: BlogVariant }

/** `/` ではPC版とSP版のDOMが同時に存在するので、脚注のidは描画先ごとに分ける */
export function anchorId(variant: BlogVariant, id: string): string {
  return variant === 'page' ? id : `${variant}-${id}`
}

/** 独立ページの見出しはh1始まり。OS内はページのh1（sr-only）の下にぶら下がるので1段下げる */
export const titleLevel = (variant: BlogVariant): 1 | 2 => (variant === 'page' ? 1 : 2)
export const sectionLevel = (variant: BlogVariant): 2 | 3 => (variant === 'page' ? 2 : 3)

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

/** ゴミ箱への導線。ページではデスクトップへ、OS内ではその場でゴミ箱を開く（読書を中断させない） */
export function TrashLink({ variant }: BlogArticleProps) {
  if (variant === 'page') return <Link href="/">デスクトップのゴミ箱</Link>
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
