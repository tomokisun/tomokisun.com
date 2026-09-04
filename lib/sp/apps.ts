// SP: アプリ開閉の物理化
// - アイコン位置からのFLIPズーム起動（visibility切替でスクロール位置は保持される）
// - ジェスチャーバー上スワイプ: 1:1追従 → 速度引き継ぎスプリングで閉じる
// - ドラッグ途中で静止するとAppスイッチャーへ（switcher.tsがemit('open-switcher')を受ける）

import { showToast } from '../ui'
import { clamp, createGesture, prefersReducedMotion, rubber, springTo } from './gesture'
import { emit, getActiveApp, getMode, pushRecent, setActiveApp, setMode } from './state'

const OPEN_MS = 320
const OPEN_FALLBACK_MS = 450
const GESTURE_TIP = '下から上へスワイプでホーム（物理ボタンは経費削減されました）'

type Flip = { dx: number; dy: number; s: number }

const sourceRects = new Map<string, DOMRect>()
const sourceOpeners = new Map<string, HTMLElement>()
let cancelFlight: (() => void) | null = null
let groundToastShown = false
let gestureTipShown = false

const viewFor = (id: string) => document.querySelector<HTMLElement>(`.sp-app-view[data-app="${id}"]`)
const homeEl = () => document.querySelector<HTMLElement>('.sp-home')

// アプリが（開閉アニメ中も含め）画面を占有しているか。ドック退避などのCSSはこの属性から導出する
// （mode=ccでも背後のアプリは開いたままなので、data-sp-mode="app"だけでは表現できない）
function setHasApp(on: boolean): void {
  document.querySelector('.sp-shell')?.toggleAttribute('data-sp-has-app', on)
}

/** アプリ表示中にアプリ地帯の外（ロック・スイッチャー等）へ抜けるときの共通クリーンアップ */
export function forceCloseActiveApp(): void {
  const id = getActiveApp()
  if (!id) return
  instantClose(id)
  setActiveApp(null)
  const home = homeEl()
  if (home) {
    home.style.transition = ''
    home.style.transform = ''
  }
}

function computeFlip(source: DOMRect, target: DOMRect): Flip {
  return {
    dx: source.left + source.width / 2 - (target.left + target.width / 2),
    dy: source.top + source.height / 2 - (target.top + target.height / 2),
    s: Math.max(source.width / target.width, 0.05),
  }
}

function fallbackFlip(view: HTMLElement): Flip {
  const rect = view.getBoundingClientRect()
  return { dx: 0, dy: rect.height * 0.35, s: 0.1 }
}

function clearFlightStyles(view: HTMLElement): void {
  view.style.transition = ''
  view.style.transform = ''
  view.style.opacity = ''
  view.style.borderRadius = ''
  view.style.willChange = ''
}

function focusInitial(view: HTMLElement): void {
  view.querySelector<HTMLElement>('.sp-app-back, button')?.focus()
}

function showGestureTipOnce(view: HTMLElement): void {
  if (gestureTipShown || !view.querySelector('.sp-gesture-bar')) return
  gestureTipShown = true
  const tip = document.createElement('div')
  tip.className = 'sp-gesture-tip'
  tip.setAttribute('role', 'status')
  tip.textContent = GESTURE_TIP
  view.appendChild(tip)
  setTimeout(() => tip.classList.add('is-leaving'), 3600)
  setTimeout(() => tip.remove(), 4000)
}

function instantClose(id: string): void {
  const view = viewFor(id)
  if (!view) return
  cancelFlight?.()
  cancelFlight = null
  view.removeAttribute('data-state')
  clearFlightStyles(view)
  setHasApp(false)
}

export function openApp(id: string, opener?: HTMLElement | null): void {
  const mode = getMode()
  if (mode !== 'home' && mode !== 'app' && mode !== 'switcher' && mode !== 'edit') return
  const view = viewFor(id)
  if (!view || view.dataset.state) return

  const current = getActiveApp()
  if (current && current !== id) instantClose(current)

  // 起動元矩形: アイコンならタイル部分、それ以外（通知バナー・カード）は要素自身
  const sourceEl = opener?.querySelector<HTMLElement>('.sp-app-icon-tile') ?? opener ?? null
  const rect = sourceEl?.getBoundingClientRect() ?? null
  if (rect && rect.width > 0) sourceRects.set(id, rect)
  if (opener) sourceOpeners.set(id, opener)

  setActiveApp(id)
  setHasApp(true)
  if (id !== 'terminal-blocked') pushRecent(id)
  setMode('app')
  emit('app-opened', id)

  if (prefersReducedMotion()) {
    view.dataset.state = 'open'
    focusInitial(view)
    showGestureTipOnce(view)
    return
  }

  const target = view.getBoundingClientRect()
  const stored = sourceRects.get(id)
  const flip = stored ? computeFlip(stored, target) : fallbackFlip(view)

  view.dataset.state = 'opening'
  view.style.transition = 'none'
  view.style.transform = `translate(${flip.dx}px, ${flip.dy}px) scale(${flip.s})`
  view.style.opacity = '0.4'
  view.style.borderRadius = '22.5%'
  view.style.willChange = 'transform, opacity'

  let finished = false
  const finalize = () => {
    if (finished) return
    finished = true
    view.removeEventListener('transitionend', onTransitionEnd)
    clearTimeout(fallback)
    if (view.dataset.state !== 'opening') return
    view.dataset.state = 'open'
    clearFlightStyles(view)
    focusInitial(view)
    showGestureTipOnce(view)
  }
  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target === view && e.propertyName === 'transform') finalize()
  }
  // transitionendはreduced-motion切替やタブ非表示で落ちることがあるためフォールバック必須
  const fallback = setTimeout(finalize, OPEN_FALLBACK_MS)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      view.style.transition = `transform ${OPEN_MS}ms var(--sp-ease), opacity 200ms ease, border-radius ${OPEN_MS}ms var(--sp-ease)`
      view.style.transform = 'translate(0px, 0px) scale(1)'
      view.style.opacity = '1'
      view.style.borderRadius = '0px'
      view.addEventListener('transitionend', onTransitionEnd)
    })
  })
}

type FlightStart = {
  x: number
  y: number
  scale: number
  radius: number
  vy: number
}

function animateClose(id: string, start: FlightStart): void {
  const view = viewFor(id)
  if (!view) return

  // ドラッグ中に別レイヤー（CC等）へモードが移っていたら、閉じアニメは諦めて即時掃除する
  // （無条件にsetMode('home')するとcc→homeを踏んでCCシートが孤児化する）
  if (getMode() !== 'app') {
    instantClose(id)
    setActiveApp(null)
    return
  }

  view.dataset.state = 'closing'
  view.style.transition = 'none'
  view.style.willChange = 'transform, opacity'
  setHasApp(false)
  setMode('home')
  emit('app-closing', id)

  const finishClose = () => {
    cancelFlight = null
    view.removeAttribute('data-state')
    clearFlightStyles(view)
    setActiveApp(null)
    const openerEl = sourceOpeners.get(id)
    if (openerEl?.isConnected && getMode() === 'home') openerEl.focus()
  }

  // 飛び先はtransformを外した素のレイアウト矩形から測る（transform中の矩形はズレる）
  const stored = sourceRects.get(id)
  view.style.transform = 'none'
  const naturalRect = view.getBoundingClientRect()
  const flip = stored ? computeFlip(stored, naturalRect) : { dx: 0, dy: naturalRect.height * 0.35, s: 0.1 }
  view.style.transform = `translate(${start.x}px, ${start.y}px) scale(${start.scale})`

  const targetRadius = 24
  const denominator = flip.dy - start.y
  const v0 = Math.abs(denominator) > 1 ? clamp(start.vy / denominator, 0, 0.02) : 0.008

  cancelFlight?.()
  cancelFlight = springTo({
    from: 0,
    to: 1,
    v0,
    onFrame: (m) => {
      const t = clamp(m, 0, 1)
      const x = start.x + (flip.dx - start.x) * t
      const y = start.y + (flip.dy - start.y) * t
      const s = start.scale + (flip.s - start.scale) * t
      const r = start.radius + (targetRadius - start.radius) * t
      view.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      view.style.borderRadius = `${r}px`
      view.style.opacity = String(t < 0.8 ? 1 : 1 - 3 * (t - 0.8))
    },
    onDone: finishClose,
  })
}

export function closeActiveApp(): void {
  const id = getActiveApp()
  if (!id) return
  const view = viewFor(id)
  if (view?.dataset.state !== 'open') return
  animateClose(id, { x: 0, y: 0, scale: 1, radius: 0, vy: 0 })
}

function setupGestureBar(view: HTMLElement): void {
  const bar = view.querySelector<HTMLElement>('.sp-gesture-bar')
  if (!bar) return
  const id = view.dataset.app ?? ''

  let switcherTaken = false
  let holdTimer = 0
  let lastDyEff = 0

  const restore = () => {
    view.dataset.state = 'open'
    clearFlightStyles(view)
    bar.classList.remove('is-grabbed')
    const home = homeEl()
    if (home) {
      home.style.transition = ''
      home.style.transform = ''
    }
  }

  const clearHold = () => {
    clearTimeout(holdTimer)
    holdTimer = 0
  }

  // ドラッグ途中で静止 → Appスイッチャー（一方向遷移）。
  // 指が止まるとpointermoveが来なくなるため、判定はタイマー側で行う。
  const enterSwitcherFromHold = () => {
    holdTimer = 0
    if (switcherTaken || view.dataset.state !== 'dragging' || getMode() !== 'app') return
    switcherTaken = true
    restore()
    instantClose(id)
    setActiveApp(null)
    emit('open-switcher', { from: 'gesture' })
  }

  createGesture(bar, {
    axis: 'y',
    onStart: () => {
      if (getMode() !== 'app' || view.dataset.state !== 'open') return false
      switcherTaken = false
      clearHold()
      view.dataset.state = 'dragging'
      view.style.willChange = 'transform'
      bar.classList.add('is-grabbed')
      const home = homeEl()
      if (home) home.style.transition = 'none'
      return undefined
    },
    onMove: (s) => {
      if (switcherTaken) return
      const dyEff = s.dy < 0 ? s.dy : rubber(s.dy, 80)
      lastDyEff = dyEff
      const p = clamp(-s.dy / (0.5 * window.innerHeight), 0, 1)
      view.style.transform = `translate(${s.dx * 0.4}px, ${dyEff}px) scale(${1 - 0.45 * p})`
      view.style.borderRadius = `${p * 24}px`
      const home = homeEl()
      if (home) home.style.transform = `scale(${0.94 + 0.06 * p})`

      // バーは画面最下端なので下方向の余地はごくわずか（rubberで数px沈むだけ）
      if (s.dy > 12 && !groundToastShown) {
        groundToastShown = true
        showToast('そっちは地面です')
      }

      // ゾーン内でmoveが180ms途絶えたら（=指が止まったら）スイッチャーへ。
      // moveごとに張り直すデバウンス。ゾーン外に出たら解除。
      if (p >= 0.2 && p <= 0.75 && -s.dy > 80) {
        clearTimeout(holdTimer)
        holdTimer = window.setTimeout(enterSwitcherFromHold, 180)
      } else {
        clearHold()
      }
    },
    onEnd: (s, isTap) => {
      clearHold()
      if (switcherTaken) {
        switcherTaken = false
        return
      }
      bar.classList.remove('is-grabbed')
      const home = homeEl()

      if (isTap) {
        // タップはbuttonのclick（data-sp-close）として通常クローズさせる
        restore()
        return
      }

      const p = clamp(-s.dy / (0.5 * window.innerHeight), 0, 1)
      if (p > 0.35 || s.vy < -0.5) {
        if (home) {
          // コミット時はCSS transitionに乗せてホームを戻す
          home.style.transition = ''
          home.style.transform = ''
        }
        animateClose(id, {
          x: s.dx * 0.4,
          y: lastDyEff,
          scale: 1 - 0.45 * p,
          radius: p * 24,
          vy: s.vy,
        })
      } else {
        // 全画面へ復帰（速度引き継ぎ）
        const fromY = lastDyEff
        cancelFlight?.()
        cancelFlight = springTo({
          from: fromY,
          to: 0,
          v0: s.vy,
          onFrame: (y) => {
            const pNow = clamp(-y / (0.5 * window.innerHeight), 0, 1)
            const ratio = Math.abs(fromY) > 1 ? y / fromY : 0
            view.style.transform = `translate(${s.dx * 0.4 * ratio}px, ${y}px) scale(${1 - 0.45 * pNow})`
            view.style.borderRadius = `${pNow * 24}px`
            if (home) home.style.transform = `scale(${0.94 + 0.06 * pNow})`
          },
          onDone: () => {
            cancelFlight = null
            restore()
          },
        })
      }
    },
    onCancel: () => {
      clearHold()
      restore()
    },
  })
}

function setupPressFeedback(): void {
  const PRESSABLE =
    '.sp-app-icon, .sp-widget, .os-button, .sp-product-item, .sp-app-back, .sp-cc-tile, .sp-statusbar button, .sp-notification-close, .calc-key'
  const pressed = new Map<number, HTMLElement>()

  document.addEventListener(
    'pointerdown',
    (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(PRESSABLE)
      if (!el) return
      el.classList.add('is-pressed')
      pressed.set(e.pointerId, el)
    },
    { capture: true, passive: true },
  )
  const release = (e: PointerEvent) => {
    pressed.get(e.pointerId)?.classList.remove('is-pressed')
    pressed.delete(e.pointerId)
  }
  document.addEventListener('pointerup', release, { capture: true, passive: true })
  document.addEventListener('pointercancel', release, { capture: true, passive: true })
}

export function setupApps(): void {
  // 開く: data-sp-open（ホーム画面などOSのクローム）と data-app-open（アプリの中から）。
  // クリック経由なのでキーボードもそのまま動く。
  document.addEventListener('click', (e) => {
    const opener = (e.target as HTMLElement).closest<HTMLElement>('[data-sp-open], [data-app-open]')
    if (!opener) return
    e.preventDefault()
    // ジグル編集中のアイコンタップは起動しない（実機と同じ。通知タップ等はopenApp直呼びで通る）
    if (getMode() === 'edit') return
    const id = opener.getAttribute('data-sp-open') ?? opener.getAttribute('data-app-open')
    if (id) openApp(id, opener)
  })

  // 閉じる: data-sp-close属性（◀ ホーム / OK / ジェスチャーバーのタップ）
  document.addEventListener('click', (e) => {
    const closer = (e.target as HTMLElement).closest<HTMLElement>('[data-sp-close]')
    if (!closer) return
    closeActiveApp()
  })

  // Escapeでもクローズ（mode=appのみ。ダイアログ表示中はui.tsが先にstopPropagationする）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getMode() === 'app') closeActiveApp()
  })

  document.querySelectorAll<HTMLElement>('.sp-app-view').forEach(setupGestureBar)
  setupPressFeedback()
}
