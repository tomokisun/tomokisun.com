// SP: 長押しジグル編集モード — アイコンは震えるが、消せない（ターミナルを除く）。

import { closeActiveApp } from './apps'
import { createGesture, springTo } from './gesture'
import { appIdFromLabel, SP_APPS } from './meta'
import { pushNotification } from './notify'
import { getMode, setMode } from './state'
import { showSpDialog, showToast } from './ui'

const LONG_PRESS_MS = 500
const PREVIEW_MS = 300

let dragAttempts = 0

function labelOf(icon: HTMLElement): string {
  return icon.querySelector('.sp-app-icon-label')?.textContent?.trim() ?? ''
}

function removeBadges(): void {
  for (const el of document.querySelectorAll('.sp-icon-remove')) el.remove()
  document.querySelector('.sp-home-done')?.remove()
}

function exitEdit(): void {
  if (getMode() !== 'edit') return
  removeBadges()
  setMode('home')
}

function refuseRemoval(icon: HTMLElement, badge: HTMLElement): void {
  const label = labelOf(icon)
  const id = appIdFromLabel(label)

  if (id === 'terminal-blocked') {
    // ターミナルだけは削除に成功する（そして5秒後にしぶとく戻ってくる）
    icon.style.transition = 'transform 260ms var(--sp-ease), opacity 200ms ease'
    icon.style.transform = 'scale(0)'
    icon.style.opacity = '0'
    icon.querySelector<HTMLElement>('.sp-icon-remove')?.remove()
    setTimeout(() => {
      pushNotification({
        icon: '＞_',
        title: 'システム',
        message: 'ターミナルが再インストールされました（しぶとい）',
      })
      icon.style.transform = 'scale(1)'
      icon.style.opacity = '1'
      setTimeout(() => {
        icon.style.transition = ''
        icon.style.transform = ''
        icon.style.opacity = ''
        if (getMode() === 'edit' && !icon.querySelector('.sp-icon-remove')) icon.appendChild(makeBadge(icon))
      }, 300)
    }, 5000)
    return
  }

  const refusal =
    (id ? SP_APPS[id]?.removeRefusal : null) ??
    (label === 'グッズ' ? 'ぼうしは消耗品ではありません' : 'このAppは削除できません（なんとなく）')
  showSpDialog('削除できません', refusal, badge)
}

function makeBadge(icon: HTMLElement): HTMLElement {
  const badge = document.createElement('button')
  badge.type = 'button'
  badge.className = 'sp-icon-remove'
  badge.setAttribute('aria-label', `${labelOf(icon)}を削除`)
  badge.textContent = '×'
  badge.addEventListener('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    refuseRemoval(icon, badge)
  })
  return badge
}

export function enterEdit(): void {
  if (getMode() !== 'home' || !setMode('edit')) return
  navigator.vibrate?.(10)

  document.querySelectorAll<HTMLElement>('.sp-home .sp-app-icon').forEach((icon) => {
    icon.appendChild(makeBadge(icon))
  })

  const done = document.createElement('button')
  done.type = 'button'
  done.className = 'sp-home-done os-button'
  done.textContent = '完了'
  done.addEventListener('click', exitEdit)
  document.querySelector('.sp-shell')?.appendChild(done)
  done.focus()
}

/** 編集モード中: アイコンをつまむと持ち上がるが、離すと必ず元の場所に戻る */
function setupEditDrag(icon: HTMLElement): void {
  createGesture(icon, {
    axis: 'any',
    onStart: () => (getMode() === 'edit' ? undefined : false),
    onMove: (s) => {
      icon.style.zIndex = '10'
      icon.style.transform = `translate(${s.dx}px, ${s.dy}px) scale(1.1)`
    },
    onEnd: (s, isTap) => {
      if (isTap) {
        icon.style.transform = ''
        icon.style.zIndex = ''
        return
      }
      const fromX = s.dx
      const fromY = s.dy
      springTo({
        from: 1,
        to: 0,
        v0: 0,
        onFrame: (m) => {
          icon.style.transform = `translate(${fromX * m}px, ${fromY * m}px) scale(${1 + 0.1 * m})`
        },
        onDone: () => {
          icon.style.transform = ''
          icon.style.zIndex = ''
        },
      })
      dragAttempts += 1
      if (dragAttempts === 3) showToast('並べ替えはv27で対応予定（未定）')
    },
    onCancel: () => {
      icon.style.transform = ''
      icon.style.zIndex = ''
    },
  })
}

export function setupEdit(): void {
  const home = document.querySelector<HTMLElement>('.sp-home')
  if (!home) return

  // 長押し検知（ホーム画面のアイコンのみ）
  let pressTimer = 0
  let previewTimer = 0
  let pressIcon: HTMLElement | null = null
  let startX = 0
  let startY = 0

  const cancelPress = () => {
    clearTimeout(pressTimer)
    clearTimeout(previewTimer)
    pressIcon?.classList.remove('is-longpress-preview')
    pressIcon = null
  }

  home.addEventListener('pointerdown', (e) => {
    if (getMode() !== 'home') return
    const icon = (e.target as HTMLElement).closest<HTMLElement>('.sp-app-icon')
    if (!icon) return
    pressIcon = icon
    startX = e.clientX
    startY = e.clientY
    previewTimer = window.setTimeout(() => icon.classList.add('is-longpress-preview'), PREVIEW_MS)
    pressTimer = window.setTimeout(() => {
      const target = pressIcon
      cancelPress()
      if (target) {
        // 長押し成立: 直後のclick（アプリ起動）を1回吸収してから編集モードへ
        const absorb = (ev: Event) => {
          ev.preventDefault()
          ev.stopPropagation()
          document.removeEventListener('click', absorb, true)
        }
        document.addEventListener('click', absorb, true)
        setTimeout(() => document.removeEventListener('click', absorb, true), 400)
        enterEdit()
      }
    }, LONG_PRESS_MS)
  })

  home.addEventListener('pointermove', (e) => {
    if (!pressIcon) return
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 8) cancelPress()
  })
  home.addEventListener('pointerup', cancelPress)
  home.addEventListener('pointercancel', cancelPress)

  document.querySelectorAll<HTMLElement>('.sp-home .sp-app-icon').forEach(setupEditDrag)

  // 背景タップ / Escape で終了
  home.addEventListener('click', (e) => {
    if (getMode() === 'edit' && e.target === home) exitEdit()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getMode() === 'edit') exitEdit()
  })

  // 設定アプリの「ホーム画面を編集」行（代替導線）
  document.querySelector<HTMLElement>('[data-sp-edit-home]')?.addEventListener('click', () => {
    // 設定アプリを閉じてから編集モードへ
    closeActiveApp()
    const tryEnter = (attempt: number) => {
      if (getMode() === 'home') enterEdit()
      else if (attempt < 20) setTimeout(() => tryEnter(attempt + 1), 60)
    }
    tryEnter(0)
  })
}
