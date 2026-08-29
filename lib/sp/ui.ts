// tomokiOS SP 共有UI: トースト / システムダイアログ
// 既存の .os-toast / .sp-dialog スタイルを流用してDOM生成する。

let toastEl: HTMLElement | null = null
let toastTimer = 0

export function showToast(message: string): void {
  toastEl?.remove()
  clearTimeout(toastTimer)

  const toast = document.createElement('div')
  toast.className = 'os-toast'
  toast.setAttribute('role', 'status')
  toast.textContent = message
  document.body.appendChild(toast)
  toastEl = toast

  toastTimer = window.setTimeout(() => {
    toast.remove()
    if (toastEl === toast) toastEl = null
  }, 2600)
}

export function showSpDialog(title: string, message: string, opener?: HTMLElement | null): void {
  document.querySelector('.sp-dialog-root')?.remove()

  const root = document.createElement('div')
  root.className = 'sp-dialog-root'

  const overlay = document.createElement('div')
  overlay.className = 'sp-dialog-overlay'

  const dialog = document.createElement('div')
  dialog.className = 'sp-dialog'
  dialog.setAttribute('role', 'alertdialog')
  dialog.setAttribute('aria-modal', 'true')

  const titleEl = document.createElement('div')
  titleEl.className = 'sp-dialog-title'
  titleEl.textContent = title
  dialog.setAttribute('aria-label', title)

  const messageEl = document.createElement('p')
  messageEl.className = 'sp-dialog-message'
  messageEl.textContent = message

  const actions = document.createElement('div')
  actions.className = 'sp-dialog-actions'

  const ok = document.createElement('button')
  ok.type = 'button'
  ok.className = 'os-button'
  ok.textContent = 'OK'

  const close = () => {
    root.remove()
    document.removeEventListener('keydown', onKeyDown)
    opener?.focus()
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    }
    // フォーカストラップ（ボタン1つなのでTabは常にOKへ）
    if (e.key === 'Tab') {
      e.preventDefault()
      ok.focus()
    }
  }

  ok.addEventListener('click', close)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close()
  })
  document.addEventListener('keydown', onKeyDown)

  actions.appendChild(ok)
  for (const el of [titleEl, messageEl, actions]) dialog.appendChild(el)
  overlay.appendChild(dialog)
  root.appendChild(overlay)
  document.body.appendChild(root)
  ok.focus()
}
