// tomokiOS SP（tomokiPhone）初期化
// 呼び出し元（lib/os.ts）で SPビューポートのときだけ呼ばれる。

import type { DeepLink } from '../deeplink'
import { openApp, setupApps } from './apps'
import { openPost, setupBlog } from './blog'
import { setupControlCenter } from './controlCenter'
import { setupEdit } from './edit'
import { setupHome } from './home'
import { isBooted, setupLock } from './lock'
import { setupNotify } from './notify'
import { setupSearch } from './search'
import { initState } from './state'
import { setupSwitcher } from './switcher'

export function initSp(deepLink?: DeepLink): void {
  const shell = document.querySelector<HTMLElement>('.sp-shell')
  if (!shell) return

  // 共有URLで来た人はロック画面を飛ばして、目的のアプリまで一気に運ぶ
  initState(shell, isBooted() || deepLink ? 'home' : 'locked')
  setupLock()
  setupHome()
  setupSearch()
  setupApps()
  setupBlog()
  setupControlCenter()
  setupNotify()
  setupSwitcher()
  setupEdit()

  // Chromiumはタッチ長押しでcontextmenuを合成発火するため、SPシェル内では抑止する
  shell.addEventListener('contextmenu', (e) => e.preventDefault())

  if (deepLink) {
    openApp(deepLink.app)
    if (deepLink.item && deepLink.app === 'blog') openPost(deepLink.item)
  }
}
