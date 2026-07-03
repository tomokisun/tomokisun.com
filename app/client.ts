import { createClient } from 'honox/client'
import {
  restoreWallpaper,
  setupBootScreen,
  setupClock,
  setupContextMenu,
  setupTerminal,
  setupTrash,
  setupWindowManager,
} from './client/os'

createClient()

restoreWallpaper()

function init(): void {
  setupBootScreen()
  setupWindowManager()
  setupClock()
  setupTerminal()
  setupTrash()
  setupContextMenu()
}

// スクリプトはasyncで読み込まれるため、DOMContentLoadedが既に発火済みの場合がある
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
