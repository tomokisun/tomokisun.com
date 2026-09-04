// Spotlight（PC）。⌘K / ⌘Space / メニューバーの🔍 でひらく。

import { type SearchHit, search } from './search'
import { openWindow } from './windows'

let root: HTMLElement | null = null
let input: HTMLInputElement | null = null
let list: HTMLElement | null = null
let cursor = 0
let hits: SearchHit[] = []

function render(): void {
  if (!list) return
  list.textContent = ''
  hits.forEach((hit, i) => {
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `os-spotlight-hit${i === cursor ? ' is-active' : ''}`
    const icon = document.createElement('span')
    icon.className = 'os-spotlight-hit-icon'
    icon.textContent = hit.icon
    const text = document.createElement('span')
    const title = document.createElement('strong')
    title.textContent = hit.title
    const sub = document.createElement('span')
    sub.className = 'os-spotlight-hit-sub'
    sub.textContent = hit.subtitle
    text.append(title, sub)
    button.append(icon, text)
    button.addEventListener('click', () => run(hit))
    li.appendChild(button)
    list?.appendChild(li)
  })
  if (!hits.length) {
    const li = document.createElement('li')
    li.className = 'os-spotlight-empty'
    li.textContent = '見つかりませんでした。このOSに無いものは、たぶんこの世にもありません。'
    list.appendChild(li)
  }
}

function run(hit: SearchHit): void {
  close()
  openWindow(hit.id)
}

function update(): void {
  hits = search(input?.value ?? '')
  cursor = 0
  render()
}

export function openSpotlight(): void {
  if (!root) return
  root.hidden = false
  if (input) input.value = ''
  update()
  input?.focus()
}

function close(): void {
  if (root) root.hidden = true
}

export function setupSpotlight(): void {
  root = document.querySelector<HTMLElement>('[data-spotlight]')
  if (!root) return
  input = root.querySelector<HTMLInputElement>('[data-spotlight-input]')
  list = root.querySelector<HTMLElement>('[data-spotlight-results]')

  input?.addEventListener('input', update)
  root.addEventListener('click', (e) => {
    if (e.target === root) close()
  })
  document.querySelector<HTMLElement>('[data-spotlight-open]')?.addEventListener('click', openSpotlight)

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) {
      e.preventDefault()
      openSpotlight()
      return
    }
    if (root?.hidden) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      cursor = (cursor + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % Math.max(hits.length, 1)
      render()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = hits[cursor]
      if (hit) run(hit)
    }
  })
}
