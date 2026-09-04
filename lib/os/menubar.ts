// メニューバーのドロップダウン。項目は data-menu-action で表され、ここが実行役になる。

import { showToast } from '../ui'
import { openLaunchpad } from './launchpad'
import { openSpotlight } from './spotlight'
import { cycleWallpaper, getWallpaperLabel } from './wallpaper'
import { closeWindow, frontWindow, minimizeWindow, openWindow, tidyWindows, toggleMission, zoomWindow } from './windows'

const BOOT_SESSION_KEY = 'tomokios-booted'

function closeAllMenus(): void {
  document.querySelectorAll<HTMLElement>('.os-menu .os-menu-drop').forEach((drop) => {
    drop.hidden = true
  })
  for (const menu of document.querySelectorAll<HTMLElement>('.os-menu')) menu.classList.remove('is-open')
}

function runAction(action: string, arg?: string): void {
  const win = frontWindow()
  switch (action) {
    case 'open':
      if (arg) openWindow(arg)
      break
    case 'reopen':
      if (win) openWindow(win.dataset.window ?? '')
      else showToast('開いているアプリがありません。Launchpad からどうぞ。')
      break
    case 'close':
      if (win) closeWindow(win)
      break
    case 'minimize':
      if (win) minimizeWindow(win)
      break
    case 'minimize-all':
      for (const open of document.querySelectorAll<HTMLElement>('.os-window.is-open:not(.is-minimized)')) {
        minimizeWindow(open)
      }
      break
    case 'zoom':
      if (win) zoomWindow(win)
      break
    case 'tidy':
      tidyWindows()
      showToast('整列しました。すぐまた散らかります。')
      break
    case 'mission':
      toggleMission()
      break
    case 'launchpad':
      openLaunchpad()
      break
    case 'spotlight':
      openSpotlight()
      break
    case 'wallpaper':
      cycleWallpaper()
      showToast(`壁紙を「${getWallpaperLabel()}」にしました。`)
      break
    case 'restart':
      try {
        sessionStorage.removeItem(BOOT_SESSION_KEY)
      } catch {}
      window.location.reload()
      break
    default:
      break
  }
}

export function setupMenuBar(): void {
  const menus = Array.from(document.querySelectorAll<HTMLElement>('.os-menu'))
  if (!menus.length) return

  for (const menu of menus) {
    const button = menu.querySelector<HTMLElement>('[data-menu-button]')
    const drop = menu.querySelector<HTMLElement>('.os-menu-drop')
    if (!button || !drop) continue

    button.addEventListener('click', (e) => {
      e.stopPropagation()
      const wasOpen = !drop.hidden
      closeAllMenus()
      if (!wasOpen) {
        drop.hidden = false
        menu.classList.add('is-open')
      }
    })
    // macOSと同じく、1つ開いていれば隣に移るだけで切り替わる
    button.addEventListener('pointerenter', () => {
      if (!document.querySelector('.os-menu.is-open')) return
      closeAllMenus()
      drop.hidden = false
      menu.classList.add('is-open')
    })
  }

  document.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-menu-action]')
    closeAllMenus()
    if (!item) return
    runAction(item.dataset.menuAction ?? '', item.dataset.menuArg)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus()
  })
}
