// Dock（PC）。近づいたアイコンが持ち上がる（macOSの拡大効果の、ドット絵版）。

import { openLaunchpad } from './launchpad'
import { toggleMission } from './windows'

const RANGE = 110
const LIFT = 14

export function setupDock(): void {
  const dock = document.querySelector<HTMLElement>('[data-dock]')
  if (!dock) return
  const items = Array.from(dock.querySelectorAll<HTMLElement>('.os-dock-item'))

  const reset = () => {
    for (const item of items) item.style.setProperty('--dock-lift', '0px')
  }

  dock.addEventListener('pointermove', (e) => {
    for (const item of items) {
      const rect = item.getBoundingClientRect()
      const distance = Math.abs(e.clientX - (rect.left + rect.width / 2))
      const lift = distance > RANGE ? 0 : LIFT * (1 - distance / RANGE) ** 2
      item.style.setProperty('--dock-lift', `${lift.toFixed(1)}px`)
    }
  })
  dock.addEventListener('pointerleave', reset)

  dock.querySelector<HTMLElement>('[data-launchpad]')?.addEventListener('click', openLaunchpad)
  dock.querySelector<HTMLElement>('[data-mission]')?.addEventListener('click', toggleMission)
}
