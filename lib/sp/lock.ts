// SP: ロック画面 — 1:1追従スワイプ解除。タップもキーボードも同じ合成スワイプ経路を通す。

import { clamp, createGesture, rubber, springTo } from './gesture'
import { emit, getMode, setMode } from './state'

const BOOT_SESSION_KEY = 'tomokios-booted'
const HINT_DEFAULT = 'うえにスワイプでログイン（素通り禁止）'
const HINT_CEILING = 'そっちは天井です'

let lockscreen: HTMLElement | null = null
let cancelSpring: (() => void) | null = null
let unlocking = false

const parallaxTargets = () =>
  lockscreen
    ? Array.from(lockscreen.querySelectorAll<HTMLElement>('.sp-lock-clock, .sp-lock-date, .sp-lock-notification'))
    : []

function applyDrag(dy: number): void {
  if (!lockscreen) return
  const up = dy < 0
  const ty = up ? dy : rubber(dy, 120)
  lockscreen.style.transform = `translateY(${ty}px)`
  lockscreen.style.opacity = String(1 - 0.9 * clamp(-dy / (0.4 * window.innerHeight), 0, 1))
  for (const el of parallaxTargets()) {
    el.style.transform = up ? `translateY(${-dy * 0.5}px)` : ''
  }

  const hint = lockscreen.querySelector<HTMLElement>('.sp-lock-hint')
  if (hint) hint.textContent = !up && ty > 40 ? HINT_CEILING : HINT_DEFAULT
}

function clearDragStyles(): void {
  if (!lockscreen) return
  lockscreen.style.transform = ''
  lockscreen.style.opacity = ''
  lockscreen.style.willChange = ''
  for (const el of parallaxTargets()) {
    el.style.transform = ''
  }
}

function setFaceId(text: string | null): void {
  const faceid = lockscreen?.querySelector<HTMLElement>('.sp-lock-faceid')
  if (!faceid) return
  if (text === null) {
    faceid.hidden = true
  } else {
    faceid.hidden = false
    faceid.textContent = text
  }
}

function settle(fromY: number, v0: number): void {
  cancelSpring?.()
  cancelSpring = springTo({
    from: fromY,
    to: 0,
    v0,
    onFrame: (y) => applyDrag(y),
    onDone: () => {
      cancelSpring = null
      clearDragStyles()
      setFaceId(null)
    },
  })
}

function commitUnlock(fromY: number, v0: number): void {
  if (!lockscreen || unlocking) return
  unlocking = true
  setFaceId('だれでもOKでした')
  const target = -window.innerHeight
  lockscreen.style.willChange = 'transform, opacity'
  cancelSpring?.()
  cancelSpring = springTo({
    from: fromY,
    to: target,
    v0,
    onFrame: (y) => {
      if (!lockscreen) return
      lockscreen.style.transform = `translateY(${y}px)`
      lockscreen.style.opacity = String(1 - 0.9 * clamp(-y / (0.4 * window.innerHeight), 0, 1))
    },
    onDone: () => {
      cancelSpring = null
      if (!lockscreen) return
      lockscreen.hidden = true
      clearDragStyles()
      setFaceId(null)
      unlocking = false
      setMode('home')
      emit('unlocked')
    },
  })
}

/** 合成スワイプ（タップ・キーボードEnter/Space・「画面ロック」解除のいずれも同一経路） */
function syntheticUnlock(): void {
  if (getMode() !== 'locked') return
  setFaceId('🍈 かおにんしょう…')
  commitUnlock(0, -1.2)
}

/** コントロールセンターの「画面ロック」タイルから呼ぶ再ロック */
export function relock(): void {
  if (!lockscreen || !setMode('locked')) return
  unlocking = false
  lockscreen.hidden = false
  clearDragStyles()
  setFaceId(null)
  const hint = lockscreen.querySelector<HTMLElement>('.sp-lock-hint')
  if (hint) hint.textContent = HINT_DEFAULT
  hint?.focus()
}

export function isBooted(): boolean {
  try {
    return sessionStorage.getItem(BOOT_SESSION_KEY) === 'true'
  } catch {
    return true
  }
}

export function setupLock(): void {
  lockscreen = document.querySelector<HTMLElement>('.sp-lockscreen')
  if (!lockscreen) return

  if (getMode() !== 'locked') {
    // 同一セッション2回目以降はロック画面を出さない（現行挙動を踏襲）
    lockscreen.hidden = true
  } else {
    try {
      sessionStorage.setItem(BOOT_SESSION_KEY, 'true')
    } catch {}
  }

  createGesture(lockscreen, {
    axis: 'y',
    onStart: () => {
      if (getMode() !== 'locked' || unlocking) return false
      cancelSpring?.()
      cancelSpring = null
      lockscreen?.style.setProperty('will-change', 'transform, opacity')
      setFaceId('🍈 かおにんしょう…')
      return undefined
    },
    onMove: (s) => applyDrag(s.dy),
    onEnd: (s, isTap) => {
      if (getMode() !== 'locked' || unlocking) return
      if (isTap) {
        syntheticUnlock()
        return
      }
      const shouldUnlock = -s.dy > 0.22 * window.innerHeight || s.vy < -0.5
      if (shouldUnlock) {
        commitUnlock(s.dy < 0 ? s.dy : 0, Math.min(s.vy, -0.4))
      } else {
        settle(s.dy < 0 ? s.dy : rubber(s.dy, 120), s.vy)
      }
    },
    onCancel: () => {
      if (unlocking) return
      clearDragStyles()
      setFaceId(null)
    },
  })

  // ヒントbutton（キーボードEnter/Space含む）。タップは親のジェスチャーがisTapで拾うため、
  // クリック由来の二重発火は unlocking フラグと合成経路の共通ガードで吸収される。
  lockscreen.querySelector<HTMLElement>('.sp-lock-hint')?.addEventListener('click', syntheticUnlock)
}
