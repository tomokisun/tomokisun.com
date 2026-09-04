// Launchpad（PC）。Dockの⌘とメニューから開く、アプリを全部並べた1枚。

let view: HTMLElement | null = null

export function openLaunchpad(): void {
  if (!view) return
  view.hidden = false
  requestAnimationFrame(() => view?.classList.add('is-open'))
  view.querySelector<HTMLElement>('[data-launchpad-item]')?.focus()
}

export function closeLaunchpad(): void {
  if (!view) return
  view.classList.remove('is-open')
  view.hidden = true
}

export function setupLaunchpad(): void {
  view = document.querySelector<HTMLElement>('[data-launchpad-view]')
  if (!view) return

  document.querySelector<HTMLElement>('[data-launchpad]')?.addEventListener('click', openLaunchpad)
  view.querySelector<HTMLElement>('[data-launchpad-close]')?.addEventListener('click', closeLaunchpad)
  view.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target === view || target.closest('[data-launchpad-item]')) closeLaunchpad()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && view && !view.hidden) closeLaunchpad()
  })
}
