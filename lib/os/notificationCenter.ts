// 通知センター（PC）。メニューバーの🔔で右から出す。

export function setupNotificationCenter(): void {
  const panel = document.querySelector<HTMLElement>('[data-notification-center]')
  const button = document.querySelector<HTMLElement>('[data-notify-open]')
  if (!panel || !button) return

  const date = panel.querySelector<HTMLElement>('[data-nc-date]')
  if (date) {
    const now = new Date()
    date.textContent = `${now.getMonth() + 1}月${now.getDate()}日`
  }

  const close = () => {
    panel.classList.remove('is-open')
    panel.hidden = true
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation()
    if (panel.hidden) {
      panel.hidden = false
      requestAnimationFrame(() => panel.classList.add('is-open'))
    } else {
      close()
    }
  })

  document.addEventListener('click', (e) => {
    if (panel.hidden) return
    if (!(e.target as HTMLElement).closest('[data-notification-center]')) close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
