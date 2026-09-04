// SP: 検索（Spotlightのスマホ版）。ホーム画面を下に引くか、アプリ一覧の検索ピルから。

import { type SearchHit, search } from '../os/search'
import { openApp } from './apps'
import { getMode } from './state'

let sheet: HTMLElement | null = null
let input: HTMLInputElement | null = null
let list: HTMLElement | null = null

function render(): void {
  if (!list) return
  const hits: SearchHit[] = search(input?.value ?? '', 10)
  list.textContent = ''
  for (const hit of hits) {
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'sp-search-hit'
    const icon = document.createElement('span')
    icon.className = 'sp-search-hit-icon'
    icon.textContent = hit.icon
    const text = document.createElement('span')
    const title = document.createElement('strong')
    title.textContent = hit.title
    const sub = document.createElement('span')
    sub.className = 'sp-search-hit-sub'
    sub.textContent = hit.subtitle
    text.append(title, sub)
    button.append(icon, text)
    button.addEventListener('click', () => {
      // ブログのきじ・プロダクトはSPだとアプリの中の話なので、親アプリを開く
      const id = hit.kind === 'app' ? hit.id : hit.id.startsWith('blog-') ? 'blog' : 'products'
      close()
      openApp(id)
    })
    li.appendChild(button)
    list.appendChild(li)
  }
}

export function openSearch(): void {
  if (!sheet || getMode() !== 'home') return
  sheet.hidden = false
  requestAnimationFrame(() => sheet?.classList.add('is-open'))
  if (input) input.value = ''
  render()
  input?.focus()
}

function close(): void {
  if (!sheet) return
  sheet.classList.remove('is-open')
  sheet.hidden = true
}

export function setupSearch(): void {
  sheet = document.querySelector<HTMLElement>('[data-sp-search]')
  if (!sheet) return
  input = sheet.querySelector<HTMLInputElement>('[data-sp-search-input]')
  list = sheet.querySelector<HTMLElement>('[data-sp-search-results]')

  input?.addEventListener('input', render)
  sheet.querySelector<HTMLElement>('[data-sp-search-close]')?.addEventListener('click', close)
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet && !sheet.hidden) {
      e.stopPropagation()
      close()
    }
  })
}
