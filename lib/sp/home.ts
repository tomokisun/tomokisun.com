// SP: ホーム画面のページめくり。
// レールを指に1:1で追従させ、離した瞬間の速度を springTo が引き継いでページに吸い付く。
// 最後のページは App ライブラリ。

import { SP_HOME_PAGES } from '@/data/apps'
import { clamp, createGesture, prefersReducedMotion, rubber, springTo } from './gesture'
import { openSearch } from './search'
import { getMode, on } from './state'

const PAGES = SP_HOME_PAGES + 1 // ＋App ライブラリ
const FLICK_VELOCITY = 0.35

let rail: HTMLElement | null = null
let dots: HTMLElement | null = null
let page = 0
let cancelSpring: (() => void) | null = null

const width = () => rail?.clientWidth || window.innerWidth

function frame(x: number): void {
  if (!rail) return
  rail.style.transform = `translate3d(${x}px, 0, 0)`
}

function syncDots(): void {
  dots?.querySelectorAll<HTMLElement>('[data-sp-dot]').forEach((dot) => {
    dot.classList.toggle('is-active', Number(dot.dataset.spDot) === page)
  })
}

function settle(from: number, v0: number): void {
  const to = -page * width()
  cancelSpring?.()
  if (prefersReducedMotion()) {
    frame(to)
    cancelSpring = null
    return
  }
  cancelSpring = springTo({
    from,
    to,
    v0,
    onFrame: frame,
    onDone: () => {
      cancelSpring = null
      frame(to)
    },
  })
}

export function goToPage(next: number, animate = true): void {
  page = clamp(next, 0, PAGES - 1)
  syncDots()
  if (animate) settle(rail ? getCurrentX() : 0, 0)
  else frame(-page * width())
}

function getCurrentX(): number {
  if (!rail) return 0
  const matrix = new DOMMatrixReadOnly(getComputedStyle(rail).transform)
  return matrix.m41
}

export function setupHome(): void {
  const home = document.querySelector<HTMLElement>('[data-sp-home]')
  rail = home?.querySelector<HTMLElement>('[data-sp-home-rail]') ?? null
  dots = home?.querySelector<HTMLElement>('[data-sp-dots]') ?? null
  if (!home || !rail) return

  syncDots()

  dots?.querySelectorAll<HTMLElement>('[data-sp-dot]').forEach((dot) => {
    dot.addEventListener('click', () => goToPage(Number(dot.dataset.spDot ?? 0)))
  })

  // ページめくりと「下に引いて検索」は同じ1本のジェスチャーで捌く。
  // （エンジンは画面で1本しか同時にエンゲージしないので、入れ子で2本置くと片方が死ぬ）
  let startX = 0
  let lock: 'x' | 'y' | null = null

  createGesture(rail, {
    axis: 'any',
    onStart: (e) => {
      if (getMode() !== 'home') return false
      if ((e.target as HTMLElement).closest('.sp-icon-remove')) return false
      cancelSpring?.()
      cancelSpring = null
      startX = getCurrentX()
      lock = null
      return undefined
    },
    onMove: (s) => {
      lock ??= Math.abs(s.dx) >= Math.abs(s.dy) ? 'x' : 'y'
      if (lock !== 'x') return
      const raw = startX + s.dx
      const min = -(PAGES - 1) * width()
      // 端はラバーバンド（実機と同じく「これ以上はない」と手で分かる）
      const x = raw > 0 ? rubber(raw, 90) : raw < min ? min + rubber(raw - min, 90) : raw
      frame(x)
    },
    onEnd: (s, isTap) => {
      const axis = lock
      lock = null
      if (isTap) return
      if (axis === 'y') {
        // 下に引いたら検索（実機と同じ導線）
        if (s.dy > 60 && s.vy > 0.15) openSearch()
        return
      }
      const moved = -s.dx / width()
      let next = page + Math.round(moved)
      if (Math.abs(s.vx) > FLICK_VELOCITY) next = page + (s.vx < 0 ? 1 : -1)
      page = clamp(next, 0, PAGES - 1)
      syncDots()
      settle(getCurrentX(), s.vx)
    },
    onCancel: () => {
      if (lock === 'x') settle(getCurrentX(), 0)
      lock = null
    },
  })

  // 幅が変わったら現在のページに置き直す（回転・アドレスバーの出入り）
  window.addEventListener('resize', () => goToPage(page, false))

  // ホームに戻ったら1ページ目へ（実機と同じ。App ライブラリに置き去りにしない）
  on('mode', (payload) => {
    const { next } = payload as { next: string }
    if (next === 'home') goToPage(0, false)
  })
}
