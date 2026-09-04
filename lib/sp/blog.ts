// SP: ブログアプリの中の階層ナビ（いちらん → きじ）。
// きじを読むためにアプリを出ない。押すと右から入り、左端スワイプ／‹ ボタン／Escapeで戻る。
// 追従中は指に1:1、離したら速度をspringTo（gesture.ts）が引き継ぐ。

import { clamp, createGesture, rubber, springTo } from './gesture'
import { getActiveApp, getMode, on } from './state'

/** 左端からこの幅までで始めたポインタだけが「戻る」ジェスチャーになる */
const EDGE_ZONE_PX = 28
/** これ以上引っぱるか、この速度を超えたら戻りが確定する */
const POP_RATIO = 0.35
const POP_VELOCITY = 0.5
/** きじの下でいちらんが控えめに追従する量（奥行きを出すためのパララックス） */
const LIST_PARALLAX = 0.25

let root: HTMLElement | null = null
let list: HTMLElement | null = null
let current: HTMLElement | null = null
let opener: HTMLElement | null = null
let cancelSpring: (() => void) | null = null
/** 進行中のスプリングを即座に終端まで飛ばす（アプリが閉じられたとき用） */
let settleNow: (() => void) | null = null

const width = (): number => root?.clientWidth || window.innerWidth

/** x = きじペインのtranslateX（0でぜんぶ見える / width で画面の外） */
function frame(x: number): void {
  if (!current) return
  const w = width()
  const p = clamp(1 - x / w, 0, 1)
  current.style.transform = `translateX(${x}px)`
  if (list) {
    list.style.transform = `translateX(${-LIST_PARALLAX * w * p}px)`
    list.style.opacity = String(1 - 0.35 * p)
  }
}

function animate(from: number, to: number, v0: number, done: () => void): void {
  cancelSpring?.()
  const finish = () => {
    cancelSpring = null
    settleNow = null
    frame(to)
    done()
  }
  settleNow = () => {
    cancelSpring?.()
    finish()
  }
  cancelSpring = springTo({ from, to, v0, onFrame: frame, onDone: finish })
}

function push(slug: string, from?: HTMLElement | null): void {
  if (!root || current) return
  const pane = root.querySelector<HTMLElement>(`.sp-blog-post[data-sp-blog-pane="${slug}"]`)
  if (!pane) return

  current = pane
  opener = from ?? null
  pane.hidden = false
  pane.scrollTop = 0
  // いちらんはきじの下に隠れるので、アプリの中だけの都合でinertにする
  // （レイヤーごとのinertは state.ts の担当。ここはその内側の話）
  if (list) list.inert = true
  frame(width())
  animate(width(), 0, 0, () => {
    pane.querySelector<HTMLElement>('[data-sp-blog-back]')?.focus()
  })
}

function pop(fromX: number, v0: number): void {
  const pane = current
  if (!pane) return
  animate(fromX, width(), v0, () => {
    pane.hidden = true
    pane.style.transform = ''
    if (list) {
      list.inert = false
      list.style.transform = ''
      list.style.opacity = ''
    }
    current = null
    const back = opener
    opener = null
    if (back?.isConnected) back.focus()
  })
}

const isReading = (): boolean => current !== null && getMode() === 'app' && getActiveApp() === 'blog'

function setupEdgeGesture(pane: HTMLElement): void {
  let lastX = 0

  createGesture(pane, {
    axis: 'x',
    onStart: (e) => {
      if (!isReading() || current !== pane) return false
      // 画面の左端から始めたときだけ戻る（本文のリンクやスクロールを邪魔しない）
      if (e.clientX - pane.getBoundingClientRect().left > EDGE_ZONE_PX) return false
      settleNow?.()
      lastX = 0
      return undefined
    },
    onMove: (s) => {
      lastX = s.dx > 0 ? s.dx : rubber(s.dx, 40)
      frame(lastX)
    },
    onEnd: (s, isTap) => {
      if (!current) return
      if (isTap) {
        frame(0)
        return
      }
      if (s.dx / width() > POP_RATIO || s.vx > POP_VELOCITY) {
        pop(lastX, s.vx)
      } else {
        animate(lastX, 0, s.vx, () => {})
      }
    },
    onCancel: () => {
      if (current) animate(lastX, 0, 0, () => {})
    },
  })
}

/** ディープリンク用: ブログアプリの中で、いきなりきじを開く */
export function openPost(slug: string): void {
  push(slug, null)
}

export function setupBlog(): void {
  root = document.querySelector<HTMLElement>('[data-sp-blog]')
  if (!root) return
  list = root.querySelector<HTMLElement>('[data-sp-blog-pane="list"]')
  root.querySelectorAll<HTMLElement>('.sp-blog-post').forEach(setupEdgeGesture)

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const open = target.closest<HTMLElement>('[data-sp-blog-open]')
    if (open) {
      push(open.getAttribute('data-sp-blog-open') ?? '', open)
      return
    }
    if (target.closest('[data-sp-blog-back]') && current) pop(0, 0)
  })

  // Escapeはきじを閉じるだけ（アプリごと閉じるapps.tsへは渡さない）。
  // ダイアログが出ているときはそちらが優先なので手を出さない。
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || !isReading()) return
      if (document.querySelector('.sp-dialog-root')) return
      e.stopPropagation()
      pop(0, 0)
    },
    true,
  )

  // アプリが閉じられたら飛行中のスプリングは畳む（読みかけの位置はそのまま残す）
  on('app-closing', (id) => {
    if (id === 'blog') settleNow?.()
  })
}
