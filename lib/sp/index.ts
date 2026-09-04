// tomokiOS SP（tomokiPhone）初期化
// 呼び出し元（lib/os.ts）で SPビューポートのときだけ呼ばれる。

import { setupApps } from './apps'
import { setupBlog } from './blog'
import { setupControlCenter } from './controlCenter'
import { setupEdit } from './edit'
import { isBooted, setupLock } from './lock'
import { setupNotify } from './notify'
import { initState } from './state'
import { setupSwitcher } from './switcher'

export function initSp(): void {
  const shell = document.querySelector<HTMLElement>('.sp-shell')
  if (!shell) return

  initState(shell, isBooted() ? 'home' : 'locked')
  setupLock()
  setupApps()
  setupBlog()
  setupControlCenter()
  setupNotify()
  setupSwitcher()
  setupEdit()

  // Chromiumはタッチ長押しでcontextmenuを合成発火するため、SPシェル内では抑止する
  shell.addEventListener('contextmenu', (e) => e.preventDefault())
}
