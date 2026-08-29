// tomokiOS SP ジェスチャーエンジン
// 全ジェスチャーはこの1本で実装する（個別のpointerイベント処理は書かない）。
// Pointer Eventsのみ使用。スクロール抑止はCSSのtouch-actionで宣言的に行う。

export type GestureState = {
  dx: number
  dy: number
  vx: number
  vy: number
  moved: boolean
}

export type GestureOpts = {
  axis: 'x' | 'y' | 'any'
  /** これ未満の移動はタップ扱い（既定8px） */
  slop?: number
  /** falseを返すとこのジェスチャーを開始しない */
  onStart?: (e: PointerEvent) => boolean | undefined
  /** rAFスロットリング済みで呼ばれる */
  onMove?: (s: GestureState) => void
  onEnd: (s: GestureState, isTap: boolean) => void
  onCancel?: () => void
}

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TAP_MS = 300
const VELOCITY_WINDOW_MS = 100

/** 直近100ms窓から速度(px/ms)を算出するリングバッファ */
export class VelocityTracker {
  private samples: { t: number; x: number; y: number }[] = []

  reset(): void {
    this.samples = []
  }

  push(x: number, y: number): void {
    this.samples.push({ t: performance.now(), x, y })
    if (this.samples.length > 6) this.samples.shift()
  }

  velocity(): { vx: number; vy: number } {
    const now = performance.now()
    const recent = this.samples.filter((s) => now - s.t <= VELOCITY_WINDOW_MS)
    const first = recent[0]
    const last = recent[recent.length - 1]
    if (!first || !last || first === last) return { vx: 0, vy: 0 }
    const dt = last.t - first.t
    if (dt <= 0) return { vx: 0, vy: 0 }
    return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt }
  }
}

/** iOS式ラバーバンド。d=最大変位感覚 */
export const rubber = (x: number, d: number): number => Math.sign(x) * d * (1 - d / (d + Math.abs(x) * 0.55))

// ドラッグ成立直後のclickを1回だけ吸収する（誤タップ防止）。
// タッチドラッグはclick自体を発生させないことがあるため、
// 新しいpointerdown（=次のインタラクション開始）が来たら即座に武装解除する。
function absorbNextClick(): void {
  const absorb = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    cleanup()
  }
  const cleanup = () => {
    document.removeEventListener('click', absorb, true)
    document.removeEventListener('pointerdown', cleanup, true)
    clearTimeout(timer)
  }
  document.addEventListener('click', absorb, true)
  document.addEventListener('pointerdown', cleanup, true)
  const timer = setTimeout(cleanup, 400)
}

// 同時にエンゲージできるジェスチャーは全画面で1本だけ（2本目の指の並行操作を遮断する）
let activeGestureOwner: symbol | null = null

export function createGesture(el: HTMLElement, opts: GestureOpts): () => void {
  const slop = opts.slop ?? 8
  const tracker = new VelocityTracker()
  const owner = Symbol('gesture')

  let pointerId: number | null = null
  let startX = 0
  let startY = 0
  let startT = 0
  let engaged = false
  let dead = false // 軸ロックで負けたポインタ
  let raf = 0
  let latest: GestureState = { dx: 0, dy: 0, vx: 0, vy: 0, moved: false }

  const reset = () => {
    pointerId = null
    engaged = false
    dead = false
    cancelAnimationFrame(raf)
    raf = 0
    tracker.reset()
    if (activeGestureOwner === owner) activeGestureOwner = null
  }

  const flushMove = () => {
    raf = 0
    if (engaged) opts.onMove?.(latest)
  }

  const onPointerDown = (e: PointerEvent) => {
    if (pointerId !== null) return
    // 他のジェスチャーがポインタを握っている間は開始しない（2本目の指を無視）
    if (activeGestureOwner !== null) return
    // onStartが拒否した場合は何も記録しない（pointerIdを占有するとその要素が死ぬ）
    if (opts.onStart?.(e) === false) return
    activeGestureOwner = owner
    pointerId = e.pointerId
    startX = e.clientX
    startY = e.clientY
    startT = performance.now()
    engaged = false
    dead = false
    tracker.reset()
    tracker.push(e.clientX, e.clientY)
    try {
      el.setPointerCapture(e.pointerId)
    } catch {}
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId || dead) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    tracker.push(e.clientX, e.clientY)

    if (!engaged) {
      if (Math.hypot(dx, dy) < slop) return
      // 軸ロック: slop超過時点で主軸が勝っていなければこのポインタは以後無視
      if (opts.axis === 'x' && Math.abs(dx) <= Math.abs(dy)) {
        dead = true
        return
      }
      if (opts.axis === 'y' && Math.abs(dy) <= Math.abs(dx)) {
        dead = true
        return
      }
      engaged = true
    }

    const { vx, vy } = tracker.velocity()
    latest = { dx, dy, vx, vy, moved: true }
    if (!raf) raf = requestAnimationFrame(flushMove)
  }

  const finish = (e: PointerEvent, cancelled: boolean) => {
    if (e.pointerId !== pointerId) return
    // rAF待ちの最終onMoveを同期フラッシュしてから終了する（呼び出し側の追従状態を最新化）
    if (raf && engaged && !cancelled) {
      cancelAnimationFrame(raf)
      raf = 0
      opts.onMove?.(latest)
    }
    const wasEngaged = engaged
    const wasDead = dead
    const { vx, vy } = tracker.velocity()
    const state: GestureState = {
      dx: e.clientX - startX,
      dy: e.clientY - startY,
      vx,
      vy,
      moved: wasEngaged,
    }
    const elapsed = performance.now() - startT
    reset()

    if (cancelled) {
      if (wasEngaged) opts.onCancel?.()
      return
    }
    if (wasDead) return
    if (wasEngaged) {
      absorbNextClick()
      opts.onEnd(state, false)
      return
    }
    const isTap = Math.hypot(state.dx, state.dy) < slop && elapsed < TAP_MS
    opts.onEnd(state, isTap)
  }

  const onPointerUp = (e: PointerEvent) => finish(e, false)
  const onPointerCancel = (e: PointerEvent) => finish(e, true)
  const onVisibilityChange = () => {
    if (document.hidden && pointerId !== null) {
      const wasEngaged = engaged
      reset()
      if (wasEngaged) opts.onCancel?.()
    }
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointercancel', onPointerCancel)
  document.addEventListener('visibilitychange', onVisibilityChange)

  return () => {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerCancel)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    reset()
  }
}

type SpringOpts = {
  from: number
  to: number
  /** 指を離した瞬間の速度(px/ms) */
  v0: number
  onFrame: (value: number) => void
  onDone: () => void
}

// 減衰スプリング近似（stiffness 400 / damping 36相当）。
// 静定条件: |残距離| < 0.5px かつ |v| < 0.05px/ms。約120〜300msで収束する。
export function springTo({ from, to, v0, onFrame, onDone }: SpringOpts): () => void {
  if (prefersReducedMotion()) {
    onFrame(to)
    onDone()
    return () => {}
  }

  const STIFFNESS = 400 // 1/s^2
  const DAMPING = 36 // 1/s
  let x = from
  let v = v0 * 1000 // px/s
  let last = performance.now()
  let raf = 0

  const step = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.032)
    last = now
    const accel = -STIFFNESS * (x - to) - DAMPING * v
    v += accel * dt
    x += v * dt
    if (Math.abs(x - to) < 0.5 && Math.abs(v) < 50) {
      onFrame(to)
      onDone()
      return
    }
    onFrame(x)
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)

  return () => cancelAnimationFrame(raf)
}

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)
