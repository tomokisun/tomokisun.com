// SP: 通知バナー — スワイプで払える・タップでアプリが開く・触っている間は消えない。

import { openApp } from './apps'
import { createGesture, rubber, springTo } from './gesture'
import { getMode, on } from './state'

type SpNotification = {
  icon: string
  title: string
  message: string
  opens?: string
}

type BannerState = 'waiting' | 'visible' | 'grabbed' | 'leaving'

const AUTO_DISMISS_MS = 5000
const RESUME_MS = 2000

let banner: HTMLElement | null = null
let state: BannerState = 'waiting'
let current: SpNotification | null = null
let dismissTimer = 0
let cancelSpring: (() => void) | null = null
const queue: SpNotification[] = []

function setContent(n: SpNotification): void {
  if (!banner) return
  const icon = banner.querySelector<HTMLElement>('.sp-notification-icon')
  const title = banner.querySelector<HTMLElement>('.sp-notification-title')
  const message = banner.querySelector<HTMLElement>('.sp-notification-message')
  if (icon) icon.textContent = n.icon
  if (title) title.textContent = n.title
  if (message) message.textContent = n.message
}

function stopDismissTimer(): void {
  clearTimeout(dismissTimer)
  dismissTimer = 0
}

function startDismissTimer(ms: number): void {
  stopDismissTimer()
  dismissTimer = window.setTimeout(() => dismiss(-0.4), ms)
}

function busy(): boolean {
  const mode = getMode()
  return mode === 'locked' || mode === 'cc' || mode === 'switcher'
}

function tryShowNext(): void {
  if (state !== 'waiting' || !queue.length || !banner) return
  if (document.hidden || busy()) {
    setTimeout(tryShowNext, 3000)
    return
  }
  current = queue.shift() ?? null
  if (!current) return
  setContent(current)
  state = 'visible'
  banner.style.transform = ''
  banner.style.transition = ''
  banner.classList.add('is-visible')
  startDismissTimer(AUTO_DISMISS_MS)
}

function hideNow(): void {
  if (!banner) return
  banner.classList.remove('is-visible')
  banner.style.transform = ''
  banner.style.transition = ''
  state = 'waiting'
  current = null
  setTimeout(tryShowNext, 400)
}

function dismiss(v0: number, fromY = 0): void {
  if (!banner || (state !== 'visible' && state !== 'grabbed')) return
  state = 'leaving'
  stopDismissTimer()
  // top(40px) + ハードシャドウ(4px)ぶんまで飛ばし切る
  const height = banner.offsetHeight + 48
  banner.style.transition = 'none'
  cancelSpring?.()
  cancelSpring = springTo({
    from: fromY,
    to: -height,
    v0,
    onFrame: (y) => {
      if (banner) banner.style.transform = `translateY(${y}px)`
    },
    onDone: () => {
      cancelSpring = null
      hideNow()
    },
  })
}

/** 通知を1件キューに積む（表示はモードとタブ可視性を見て自動で行う） */
export function pushNotification(n: SpNotification): void {
  queue.push(n)
  tryShowNext()
}

export function setupNotify(): void {
  banner = document.querySelector<HTMLElement>('.sp-notification')
  if (!banner) return

  // 既定キュー: ロック解除後30秒で infra.zip 通知（1回だけ）
  let scheduled = false
  const scheduleDefault = () => {
    if (scheduled) return
    scheduled = true
    let delivered = false
    let remaining = 30_000
    let startedAt = performance.now()
    let timer = 0
    const arm = () => {
      if (delivered) return
      startedAt = performance.now()
      timer = window.setTimeout(() => {
        delivered = true
        document.removeEventListener('visibilitychange', onVisibility)
        pushNotification({
          icon: '🗑',
          title: 'ゴミ箱',
          message: 'infra.zip がゴミ箱で3年間眠っています',
          opens: 'trash',
        })
      }, remaining)
    }
    // タブが非表示の間はタイマーを止める（戻ってきた頃に通知が来る演出と一石二鳥）
    const onVisibility = () => {
      if (delivered) return
      if (document.hidden) {
        clearTimeout(timer)
        remaining = Math.max(1000, remaining - (performance.now() - startedAt))
      } else {
        arm()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    if (!document.hidden) arm()
  }

  if (getMode() === 'locked') on('unlocked', scheduleDefault)
  else scheduleDefault()

  createGesture(banner, {
    axis: 'y',
    onStart: () => {
      if (state !== 'visible' && state !== 'leaving') return false
      cancelSpring?.()
      cancelSpring = null
      state = 'grabbed'
      stopDismissTimer()
      if (banner) banner.style.transition = 'none'
      return undefined
    },
    onMove: (s) => {
      if (!banner) return
      const y = s.dy < 0 ? s.dy : rubber(s.dy, 40)
      banner.style.transform = `translateY(${y}px)`
    },
    onEnd: (s, isTap) => {
      if (!banner) return
      if (isTap) {
        state = 'visible'
        const opens = current?.opens
        dismiss(-0.6)
        if (opens) openApp(opens, banner)
        return
      }
      if (s.dy < -18 || s.vy < -0.4) {
        dismiss(Math.min(s.vy, -0.3), s.dy < 0 ? s.dy : 0)
      } else {
        // 復帰
        const fromY = s.dy < 0 ? s.dy : rubber(s.dy, 40)
        cancelSpring?.()
        cancelSpring = springTo({
          from: fromY,
          to: 0,
          v0: s.vy,
          onFrame: (y) => {
            if (banner) banner.style.transform = `translateY(${y}px)`
          },
          onDone: () => {
            cancelSpring = null
            if (!banner) return
            banner.style.transform = ''
            banner.style.transition = ''
            state = 'visible'
            startDismissTimer(RESUME_MS)
          },
        })
      }
    },
    onCancel: () => {
      if (!banner) return
      banner.style.transform = ''
      banner.style.transition = ''
      state = 'visible'
      startDismissTimer(RESUME_MS)
    },
  })

  banner.querySelector<HTMLElement>('.sp-notification-close')?.addEventListener('click', (e) => {
    e.stopPropagation()
    dismiss(-0.6)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (state === 'visible' || state === 'grabbed') && getMode() !== 'cc') {
      dismiss(-0.6)
    }
  })
}
