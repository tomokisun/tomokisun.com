// tomokiOS 26 "Cream Soda" クライアントサイドの入口。
//
// ここは組み立てだけを担当する。中身はそれぞれのモジュールへ:
//   windows / dock / launchpad / spotlight / menubar / notificationCenter … PCのOSクローム
//   terminal / desktopExtras / wallpaper                                   … 共通のOS機能
//   ../apps/*                                                             … 各アプリの中身
//   ../sp/*                                                               … SP（tomokiPhone）一式
//
// 【根幹ルール】URLは「ページ」ではなく、OSのどのアプリを開くかを表すディープリンク。
// アプリはすべてこのOSの中で開き、外のページには出さない。

import { setupCalculators } from '../apps/calculator'
import { setupQuips, setupSegmented } from '../apps/common'
import { setupDevApps } from '../apps/dev'
import { setupLifeApps } from '../apps/life'
import { setupMediaApps } from '../apps/media'
import { setupNotepads } from '../apps/notepad'
import { setupTimeApps } from '../apps/time'
import { setupWorkApps } from '../apps/work'
import type { DeepLink } from '../deeplink'
import { openWindowIds } from '../deeplink'
import { initSp } from '../sp'
import { setupAdoption } from './adopt'
import { setupBootScreen, setupClock, setupContextMenu, setupTabTitle, setupTrash } from './desktopExtras'
import { setupDock } from './dock'
import { setupLaunchpad } from './launchpad'
import { setupMenuBar } from './menubar'
import { setupNotificationCenter } from './notificationCenter'
import { setupSpotlight } from './spotlight'
import { setupTerminal } from './terminal'
import { restoreWallpaper, setupWallpaperControls } from './wallpaper'
import { openWindow, setupWindowManager } from './windows'

export { cycleWallpaper, getWallpaperLabel } from './wallpaper'

const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches

/** URLで指定されたアプリを開く（PCのみ。SPは initSp が受け持つ） */
function applyDeepLink(link: DeepLink): void {
  for (const id of openWindowIds(link)) openWindow(id)
}

type InitOptions = { deepLink?: DeepLink }

export function initOS({ deepLink }: InitOptions = {}): void {
  restoreWallpaper()
  setupBootScreen()

  // アプリの本体を、いま見えているほうの器（PCのウィンドウ / SPのアプリ画面）へ移す。
  // 配線より先に済ませておくと、以後は「本体はひとつ」として扱える。
  setupAdoption()

  // アプリの中身の配線（本体はOSにひとつだけ）
  setupQuips()
  setupSegmented()
  setupNotepads()
  setupCalculators()
  setupTimeApps()
  setupMediaApps()
  setupLifeApps()
  setupWorkApps()
  setupDevApps()
  setupTrash()
  setupWallpaperControls()
  setupClock()
  setupTabTitle()

  if (isDesktopViewport()) {
    setupWindowManager()
    setupDock()
    setupLaunchpad()
    setupSpotlight()
    setupMenuBar()
    setupNotificationCenter()
    setupTerminal()
    setupContextMenu()
    if (deepLink) applyDeepLink(deepLink)
  } else {
    initSp(deepLink)
  }
}
