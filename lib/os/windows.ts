// PCのウィンドウ管理。開閉・フォーカス・ドラッグ・リサイズ・しまう・拡大・Mission Control。
// ウィンドウの「正体」は .os-window[data-window] だけで、状態はすべてクラス名で表す。

import { findApp } from '@/data/apps'
import { showToast } from '../ui'

const OPEN_MS = 240
const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let zCounter = 10
let missionOn = false

export const winOf = (id: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`.os-window[data-window="${id}"]`)

const openWindows = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('.os-window.is-open:not(.is-minimized)'))

export function focusWindow(win: HTMLElement): void {
  zCounter += 1
  win.style.zIndex = String(zCounter)
  for (const other of document.querySelectorAll<HTMLElement>('.os-window')) {
    other.classList.toggle('is-blurred', other !== win)
  }
  updateMenuBarApp(win)
  updateDockDots()
}

function updateMenuBarApp(win: HTMLElement | null): void {
  const label = document.querySelector<HTMLElement>('[data-menubar-app]')
  if (!label) return
  const id = win?.dataset.window ?? ''
  label.textContent = findApp(id)?.name ?? (id ? (win?.getAttribute('aria-label') ?? 'tomokiOS') : 'tomokiOS')
}

export function updateDockDots(): void {
  document.querySelectorAll<HTMLElement>('[data-dock-app]').forEach((item) => {
    const id = item.dataset.dockApp ?? ''
    item.classList.toggle('is-running', Boolean(winOf(id)?.classList.contains('is-open')))
  })
}

/** 起動元（アイコン・Dock）から飛んでくる開き方 */
function flyOpen(win: HTMLElement, source: HTMLElement | null): void {
  if (prefersReducedMotion()) return
  const from = source?.getBoundingClientRect()
  const to = win.getBoundingClientRect()
  if (!from || from.width === 0 || to.width === 0) return

  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  const scale = Math.max(from.width / to.width, 0.08)

  win.style.transition = 'none'
  win.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
  win.style.opacity = '0.35'
  requestAnimationFrame(() => {
    win.style.transition = `transform ${OPEN_MS}ms cubic-bezier(0.32,0.72,0,1), opacity ${OPEN_MS}ms ease`
    win.style.transform = ''
    win.style.opacity = '1'
    setTimeout(() => {
      win.style.transition = ''
      win.style.opacity = ''
    }, OPEN_MS + 20)
  })
}

export function openWindow(id: string, source?: HTMLElement | null): HTMLElement | null {
  const win = winOf(id)
  if (!win) return null
  const wasOpen = win.classList.contains('is-open') && !win.classList.contains('is-minimized')
  win.classList.add('is-open')
  if (win.classList.contains('is-minimized')) restore(win)
  focusWindow(win)
  if (!wasOpen) flyOpen(win, source ?? null)
  return win
}

export function closeWindow(win: HTMLElement): void {
  win.classList.remove('is-open', 'is-zoomed', 'is-minimized')
  win.style.transform = ''
  const next = openWindows().at(-1)
  if (next) focusWindow(next)
  else updateMenuBarApp(null)
  updateDockDots()
}

// ===== しまう（Dockの棚へ） =====
function shelf(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-dock-shelf]')
}

function restore(win: HTMLElement): void {
  win.classList.remove('is-minimized')
  const id = win.dataset.window ?? ''
  shelf()?.querySelector(`[data-shelf-item="${id}"]`)?.remove()
}

export function minimizeWindow(win: HTMLElement): void {
  const id = win.dataset.window ?? ''
  const app = findApp(id)
  const bar = shelf()
  if (bar && !bar.querySelector(`[data-shelf-item="${id}"]`)) {
    const chip = document.createElement('button')
    chip.type = 'button'
    chip.className = `os-dock-shelf-item tile-${app?.color ?? 'cream'}`
    chip.setAttribute('data-shelf-item', id)
    chip.setAttribute('aria-label', `${app?.name ?? id} をもどす`)
    chip.textContent = app?.icon ?? '🪟'
    chip.addEventListener('click', () => openWindow(id, chip))
    bar.appendChild(chip)
  }
  win.classList.add('is-minimized')
  const next = openWindows().at(-1)
  if (next) focusWindow(next)
  else updateMenuBarApp(null)
}

export function zoomWindow(win: HTMLElement): void {
  const zoomed = win.classList.toggle('is-zoomed')
  if (zoomed) {
    win.style.left = ''
    win.style.top = ''
  }
  focusWindow(win)
}

// ===== Mission Control =====
export function toggleMission(): void {
  const view = document.querySelector<HTMLElement>('[data-mission-view]')
  const desktop = document.querySelector<HTMLElement>('[data-desktop]')
  if (!view || !desktop) return

  if (missionOn) {
    missionOn = false
    view.hidden = true
    desktop.classList.remove('is-mission')
    for (const win of document.querySelectorAll<HTMLElement>('.os-window')) {
      win.style.transform = ''
      win.style.transition = ''
    }
    return
  }

  const wins = openWindows()
  if (!wins.length) {
    showToast('しまうウィンドウがありません。まずは何か開いてください。')
    return
  }

  missionOn = true
  view.hidden = false
  desktop.classList.add('is-mission')

  const area = desktop.getBoundingClientRect()
  const cols = Math.ceil(Math.sqrt(wins.length))
  const rows = Math.ceil(wins.length / cols)
  const cellW = area.width / cols
  const cellH = (area.height - 40) / rows

  wins.forEach((win, i) => {
    const rect = win.getBoundingClientRect()
    const col = i % cols
    const row = Math.floor(i / cols)
    const scale = Math.min((cellW * 0.8) / rect.width, (cellH * 0.8) / rect.height, 1)
    const targetX = area.left + cellW * (col + 0.5)
    const targetY = area.top + 40 + cellH * (row + 0.5)
    const dx = targetX - (rect.left + rect.width / 2)
    const dy = targetY - (rect.top + rect.height / 2)
    win.style.transition = 'transform 260ms cubic-bezier(0.32,0.72,0,1)'
    win.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
  })
}

// ===== ドラッグ・リサイズ =====
function setupDrag(): void {
  const desktop = document.querySelector<HTMLElement>('[data-desktop]')
  if (!desktop) return

  document.querySelectorAll<HTMLElement>('[data-drag-handle]').forEach((handle) => {
    handle.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!isDesktopViewport() || missionOn) return
      if ((e.target as HTMLElement).closest('button')) return

      const win = handle.closest<HTMLElement>('.os-window')
      if (!win || win.classList.contains('is-zoomed')) return

      const desktopRect = desktop.getBoundingClientRect()
      const winRect = win.getBoundingClientRect()
      const offsetX = e.clientX - winRect.left
      const offsetY = e.clientY - winRect.top

      win.classList.add('is-dragging')
      handle.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        const left = ev.clientX - desktopRect.left - offsetX
        const top = ev.clientY - desktopRect.top - offsetY
        win.style.left = `${Math.min(Math.max(left, 80 - winRect.width), desktopRect.width - 80)}px`
        win.style.top = `${Math.min(Math.max(top, 0), desktopRect.height - 40)}px`
      }
      const onUp = () => {
        win.classList.remove('is-dragging')
        handle.removeEventListener('pointermove', onMove)
        handle.removeEventListener('pointerup', onUp)
        handle.removeEventListener('pointercancel', onUp)
      }
      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', onUp)
      handle.addEventListener('pointercancel', onUp)
    })

    // タイトルバーのダブルクリックで拡大 / 元に戻す（macOSと同じ）
    handle.addEventListener('dblclick', (e) => {
      if ((e.target as HTMLElement).closest('button')) return
      const win = handle.closest<HTMLElement>('.os-window')
      if (win) zoomWindow(win)
    })
  })
}

function setupResize(): void {
  document.querySelectorAll<HTMLElement>('[data-resize]').forEach((grip) => {
    grip.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!isDesktopViewport()) return
      const win = grip.closest<HTMLElement>('.os-window')
      if (!win || win.classList.contains('is-zoomed')) return
      e.preventDefault()
      const rect = win.getBoundingClientRect()
      const startX = e.clientX
      const startY = e.clientY
      grip.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        win.style.width = `${Math.max(240, rect.width + ev.clientX - startX)}px`
        win.style.height = `${Math.max(160, rect.height + ev.clientY - startY)}px`
      }
      const onUp = () => {
        grip.removeEventListener('pointermove', onMove)
        grip.removeEventListener('pointerup', onUp)
        grip.removeEventListener('pointercancel', onUp)
      }
      grip.addEventListener('pointermove', onMove)
      grip.addEventListener('pointerup', onUp)
      grip.addEventListener('pointercancel', onUp)
    })
  })
}

/** 開いているウィンドウを既定の位置に戻す */
export function tidyWindows(): void {
  for (const win of document.querySelectorAll<HTMLElement>('.os-window')) {
    win.style.left = ''
    win.style.top = ''
    win.style.width = ''
    win.style.height = ''
    win.classList.remove('is-zoomed')
  }
}

export function frontWindow(): HTMLElement | null {
  return openWindows().at(-1) ?? null
}

export function setupWindowManager(): void {
  for (const win of document.querySelectorAll<HTMLElement>('.os-window')) {
    win.addEventListener('pointerdown', () => {
      if (missionOn) {
        toggleMission()
        focusWindow(win)
        return
      }
      focusWindow(win)
    })
  }

  // data-open はOSのクローム（アイコン・Dock・メニュー）から、
  // data-app-open はアプリの中から。PCではどちらもウィンドウを開くことに解釈される。
  document.addEventListener('click', (e) => {
    const opener = (e.target as HTMLElement).closest<HTMLElement>('[data-open], [data-app-open]')
    if (!opener) return
    const id = opener.getAttribute('data-open') ?? opener.getAttribute('data-app-open')
    if (!id) return
    e.preventDefault()
    openWindow(id, opener)
  })

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const win = target.closest<HTMLElement>('.os-window')
    if (!win) return
    if (target.closest('[data-close]')) closeWindow(win)
    else if (target.closest('[data-minimize]')) minimizeWindow(win)
    else if (target.closest('[data-zoom]')) zoomWindow(win)
  })

  document.addEventListener('keydown', (e) => {
    if (!isDesktopViewport()) return
    if (e.key === 'Escape' && missionOn) {
      toggleMission()
      return
    }
    // ⌘W / ⌘M（macOSに合わせる。ブラウザのタブは閉じさせない）
    if ((e.metaKey || e.ctrlKey) && (e.key === 'w' || e.key === 'm')) {
      const win = frontWindow()
      if (!win) return
      e.preventDefault()
      if (e.key === 'w') closeWindow(win)
      else minimizeWindow(win)
    }
  })

  setupDrag()
  setupResize()
  updateDockDots()
  const front = frontWindow()
  if (front) updateMenuBarApp(front)
}
