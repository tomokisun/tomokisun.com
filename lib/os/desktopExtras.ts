// 起動画面・時計・ゴミ箱・右クリックメニュー・タブ離脱検知。
// OSの「まわりのもの」をまとめた場所。

import { showToast } from '../ui'
import { openLaunchpad } from './launchpad'
import { cycleWallpaper } from './wallpaper'
import { openWindow, tidyWindows, toggleMission } from './windows'

const BOOT_DURATION_MS = 1800
const BOOT_FADE_MS = 400
const BOOT_SESSION_KEY = 'tomokios-booted'

const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function setupClock(): void {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]')
  if (!clocks.length) return
  const tick = () => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    for (const el of clocks) el.textContent = timeStr
  }
  tick()
  setInterval(tick, 10_000)
}

export function setupBootScreen(): void {
  if (!isDesktopViewport()) return
  try {
    if (sessionStorage.getItem(BOOT_SESSION_KEY)) return
    sessionStorage.setItem(BOOT_SESSION_KEY, 'true')
  } catch {
    return
  }

  const boot = document.createElement('div')
  boot.className = 'os-boot'
  boot.setAttribute('role', 'status')
  boot.setAttribute('aria-label', 'tomokiOS 起動中')

  const logo = document.createElement('div')
  logo.className = 'os-boot-logo'
  logo.textContent = '🍈'
  const name = document.createElement('div')
  name.className = 'os-boot-name'
  name.textContent = 'tomokiOS 26'
  const bar = document.createElement('div')
  bar.className = 'os-boot-bar'
  const fill = document.createElement('div')
  fill.className = 'os-boot-bar-fill'
  bar.appendChild(fill)
  const log = document.createElement('div')
  log.className = 'os-boot-log'

  for (const el of [logo, name, bar, log]) boot.appendChild(el)
  document.body.appendChild(boot)

  const duration = prefersReducedMotion() ? 400 : BOOT_DURATION_MS
  const lines = [
    'tomokiOS 26 (Build 2006A)',
    'メモリチェック ... 640KB OK（じゅうぶん）',
    'なつかしさドライバ ... 読込完了',
    'アプリを70個マウント ... 完了',
    'インフラ層 ... スキップ（苦手）',
    'ようこそ！',
  ]
  lines.forEach((line, i) => {
    setTimeout(
      () => {
        log.textContent = line
      },
      (duration / lines.length) * i,
    )
  })

  setTimeout(() => {
    boot.classList.add('is-done')
    setTimeout(() => boot.remove(), BOOT_FADE_MS)
  }, duration)
}

let trashAttempts = 0

export function setupTrash(): void {
  document.querySelectorAll<HTMLElement>('[data-trash-message]').forEach((message) => {
    const root = message.closest('.trash-body')
    root?.querySelector('[data-trash-restore]')?.addEventListener('click', () => {
      trashAttempts++
      message.textContent =
        trashAttempts >= 3
          ? '発掘: kubectl.exe（未使用）、terraform入門.pdf（1ページ目まで読了）'
          : '復元に失敗しました：本人がインフラを苦手としているため。'
    })
    root?.querySelector('[data-trash-empty]')?.addEventListener('click', () => {
      message.textContent = 'infra.zip は削除できませんでした。思い出なので。'
    })
  })
}

export function setupContextMenu(): void {
  let menu: HTMLElement | null = null

  const closeMenu = () => {
    menu?.remove()
    menu = null
  }

  const addItem = (parent: HTMLElement, label: string, action: () => void) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('role', 'menuitem')
    button.textContent = label
    button.addEventListener('click', () => {
      closeMenu()
      action()
    })
    parent.appendChild(button)
  }

  document.addEventListener('contextmenu', (e) => {
    if (!(e.target as HTMLElement).closest('[data-desktop]')) return
    e.preventDefault()
    closeMenu()

    menu = document.createElement('div')
    menu.className = 'os-context'
    menu.setAttribute('role', 'menu')

    addItem(menu, '壁紙を変更', cycleWallpaper)
    addItem(menu, 'ウィンドウを整列', () => {
      tidyWindows()
      showToast('整列しました。すぐまた散らかります。')
    })
    addItem(menu, 'Mission Control', toggleMission)
    addItem(menu, 'Launchpad', openLaunchpad)
    menu.appendChild(document.createElement('hr'))
    addItem(menu, 'このOSについて', () => openWindow('about'))
    addItem(menu, '再起動', () => {
      try {
        sessionStorage.removeItem(BOOT_SESSION_KEY)
      } catch {}
      window.location.reload()
    })

    document.body.appendChild(menu)
    const rect = menu.getBoundingClientRect()
    menu.style.left = `${Math.max(Math.min(e.clientX, window.innerWidth - rect.width - 8), 8)}px`
    menu.style.top = `${Math.max(Math.min(e.clientY, window.innerHeight - rect.height - 8), 8)}px`
  })

  document.addEventListener('click', closeMenu)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })
}

export function setupTabTitle(): void {
  const originalTitle = document.title
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '⚠ 作業中のまま放置されています' : originalTitle
  })
}
