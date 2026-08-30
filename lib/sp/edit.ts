// SP: 長押しジグル編集モード — アイコンは震えるが、消せない（ターミナルを除く）。

import { closeActiveApp } from './apps'
import { createGesture, springTo } from './gesture'
import { appIdFromLabel, SP_APPS } from './meta'
import { pushNotification } from './notify'
import { getMode, on, setMode } from './state'
import { showSpDialog, showToast } from './ui'

const LONG_PRESS_MS = 500
const PREVIEW_MS = 300

let dragAttempts = 0
// アイコン→×バッジ（バッジはbutton-in-buttonを避けるため.sp-homeへ兄弟として置く）
const badges = new Map<HTMLElement, HTMLElement>()

function labelOf(icon: HTMLElement): string {
  return icon.querySelector('.sp-app-icon-label')?.textContent?.trim() ?? ''
}

function removeBadges(): void {
  for (const el of document.querySelectorAll('.sp-icon-remove')) el.remove()
  for (const el of document.querySelectorAll('.sp-home-done')) el.remove()
  badges.clear()
}

function exitEdit(): void {
  if (getMode() !== 'edit') return
  setMode('home') // バッジ掃除はon('mode')リスナーが行う
}

function refuseRemoval(icon: HTMLElement, badge: HTMLElement): void {
  const label = labelOf(icon)
  const id = appIdFromLabel(label)

  if (id === 'terminal-blocked') {
    // ターミナルだけは削除に成功する（そして5秒後にしぶとく戻ってくる）
    icon.style.transition = 'transform 260ms var(--sp-ease), opacity 200ms ease'
    icon.style.transform = 'scale(0)'
    icon.style.opacity = '0'
    badge.remove()
    badges.delete(icon)
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
        if (getMode() === 'edit') attachBadge(icon)
      }, 300)
    }, 5000)
    return
  }

  const refusal =
    (id ? SP_APPS[id]?.removeRefusal : null) ??
    (label === 'グッズ' ? 'ぼうしは消耗品ではありません' : 'このAppは削除できません（なんとなく）')
  showSpDialog('削除できません', refusal, badge)
}

function attachBadge(icon: HTMLElement): void {
  if (badges.has(icon)) return
  const home = icon.closest<HTMLElement>('.sp-home')
  if (!home) return
  const badge = document.createElement('button')
  badge.type = 'button'
  badge.className = 'sp-icon-remove'
  badge.setAttribute('aria-label', `${labelOf(icon)}を削除`)
  badge.textContent = '×'
  // アイコン（button）の中に入れるとbutton-in-buttonで不正になるため、
  // .sp-home直下に置いてアイコンのレイアウト位置へ絶対配置する
  badge.style.left = `${icon.offsetLeft - 6}px`
  badge.style.top = `${icon.offsetTop - 8}px`
  badge.addEventListener('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    refuseRemoval(icon, badge)
  })
  home.appendChild(badge)
  badges.set(icon, badge)
}

export function enterEdit(): void {
  if (getMode() !== 'home' || !setMode('edit')) return
  navigator.vibrate?.(10)
  removeBadges() // 万一の残留に備えて冪等に

  // 編集モードのpadding変化を反映してから位置を測る
  requestAnimationFrame(() => {
    if (getMode() !== 'edit') return
    document.querySelectorAll<HTMLElement>('.sp-home .sp-app-icon').forEach((icon) => {
      attachBadge(icon)
    })
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
  let cancelSpring: (() => void) | null = null

  const settle = () => {
    icon.style.transform = ''
    icon.style.zIndex = ''
  }

  createGesture(icon, {
    axis: 'any',
    onStart: () => {
      if (getMode() !== 'edit') return false
      cancelSpring?.()
      cancelSpring = null
      return undefined
    },
    onMove: (s) => {
      icon.style.zIndex = '10'
      icon.style.transform = `translate(${s.dx}px, ${s.dy}px) scale(1.1)`
    },
    onEnd: (s, isTap) => {
      if (isTap) {
        settle()
        return
      }
      const fromX = s.dx
      const fromY = s.dy
      cancelSpring = springTo({
        from: 1,
        to: 0,
        v0: 0,
        onFrame: (m) => {
          icon.style.transform = `translate(${fromX * m}px, ${fromY * m}px) scale(${1 + 0.1 * m})`
        },
        onDone: () => {
          cancelSpring = null
          settle()
        },
      })
      dragAttempts += 1
      if (dragAttempts === 3) showToast('並べ替えはv27で対応予定（未定）')
    },
    onCancel: settle,
  })
}

export function setupEdit(): void {
  const home = document.querySelector<HTMLElement>('.sp-home')
  if (!home) return

  // 編集モードのDOM副作用はモード遷移に追従して必ず掃除する
  // （edit→cc→locked/switcher の経路でもexitEditを経ずにhomeへ戻れるため）
  on('mode', (payload) => {
    const { next } = payload as { prev: string; next: string }
    if (next !== 'edit' && next !== 'cc') removeBadges()
  })

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
    cancelPress() // 2本目の指などで前の押下が残っていても必ず掃除する
    if (getMode() !== 'home' || !e.isPrimary) return
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
    if (!pressIcon || !e.isPrimary) return
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
