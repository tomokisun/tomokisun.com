// SP: Appスイッチャー — scroll-snapの横レール + カード上フリックで終了。
// ターミナルは常駐する（終了できない。もともと起動していないので）。

import { openApp } from './apps'
import { createGesture, springTo } from './gesture'
import { SP_APPS } from './meta'
import { clearRecents, getMode, getRecents, on, removeRecent, setMode } from './state'
import { showToast } from './ui'

let switcher: HTMLElement | null = null
let rail: HTMLElement | null = null
let terminalToastShown = false

function buildCard(id: string, persistent: boolean): HTMLElement {
  const meta = SP_APPS[id]
  const card = document.createElement('div')
  card.className = 'sp-switcher-card'
  card.dataset.app = id
  if (persistent) card.dataset.persistent = 'true'

  const open = document.createElement('button')
  open.type = 'button'
  open.className = 'sp-switcher-card-open'
  open.setAttribute('aria-label', `${meta?.label ?? id} をひらく`)

  const band = document.createElement('div')
  band.className = `sp-switcher-card-band tb-${meta?.color ?? 'soda'}`
  band.textContent = meta?.label ?? id

  const body = document.createElement('div')
  body.className = 'sp-switcher-card-body'
  const icon = document.createElement('span')
  icon.className = `sp-switcher-card-icon tile-${meta?.color ?? 'soda'}`
  icon.textContent = meta?.icon ?? '❓'
  body.appendChild(icon)

  const name = document.createElement('div')
  name.className = 'sp-switcher-card-name'
  name.textContent = meta?.label ?? id
  if (persistent) {
    const sub = document.createElement('span')
    sub.className = 'sp-switcher-card-sub'
    sub.textContent = '応答なし'
    name.appendChild(sub)
  }

  for (const el of [band, body, name]) open.appendChild(el)

  const kill = document.createElement('button')
  kill.type = 'button'
  kill.className = 'sp-switcher-card-kill'
  kill.setAttribute('aria-label', `${meta?.label ?? id} を終了`)
  kill.textContent = '×'

  card.appendChild(open)
  card.appendChild(kill)

  open.addEventListener('click', () => {
    if (getMode() !== 'switcher') return
    openApp(id, card) // 矩形が生きているうちに起動（switcher → app）
    if (getMode() === 'app') hide()
  })
  kill.addEventListener('click', () => killCard(card, 0))

  setupCardGesture(card)
  return card
}

function killCard(card: HTMLElement, v0: number): void {
  const id = card.dataset.app ?? ''
  const persistent = card.dataset.persistent === 'true'
  card.style.transition = 'none'
  springTo({
    from: 0,
    to: -(window.innerHeight * 0.7),
    v0: Math.min(v0, -0.4),
    onFrame: (y) => {
      card.style.transform = `translateY(${y}px)`
      card.style.opacity = String(Math.max(0, 1 + y / (window.innerHeight * 0.6)))
    },
    onDone: () => {
      if (persistent) {
        // ターミナルは殺せない。400ms後にしれっと復活する
        setTimeout(() => {
          card.style.transition = 'transform 260ms var(--sp-ease), opacity 200ms ease'
          card.style.transform = 'scale(1)'
          card.style.opacity = '1'
          if (!terminalToastShown) {
            terminalToastShown = true
            showToast('終了できませんでした。もともと起動していません。')
          }
        }, 400)
        card.style.transform = 'scale(0)'
        return
      }
      removeRecent(id)
      card.remove()
      updateEmptyState()
    },
  })
}

function setupCardGesture(card: HTMLElement): void {
  createGesture(card, {
    axis: 'y',
    onStart: () => {
      if (getMode() !== 'switcher') return false
      card.style.transition = 'none'
      return undefined
    },
    onMove: (s) => {
      const y = Math.min(s.dy, 0)
      card.style.transform = `translateY(${y}px)`
      card.style.opacity = String(Math.max(0.2, 1 + y / (window.innerHeight * 0.6)))
    },
    onEnd: (s, isTap) => {
      if (isTap) return // clickに任せる（open/killボタンが拾う）
      if (-s.dy > 100 || s.vy < -0.5) {
        killCard(card, s.vy)
      } else {
        springTo({
          from: Math.min(s.dy, 0),
          to: 0,
          v0: s.vy,
          onFrame: (y) => {
            card.style.transform = `translateY(${y}px)`
            card.style.opacity = String(Math.max(0.2, 1 + y / (window.innerHeight * 0.6)))
          },
          onDone: () => {
            card.style.transform = ''
            card.style.opacity = ''
            card.style.transition = ''
          },
        })
      }
    },
    onCancel: () => {
      card.style.transform = ''
      card.style.opacity = ''
      card.style.transition = ''
    },
  })
}

function updateEmptyState(): void {
  if (!switcher || !rail) return
  const hasApps = rail.querySelectorAll('.sp-switcher-card:not([data-persistent])').length > 0
  switcher.querySelector<HTMLElement>('.sp-switcher-empty')?.toggleAttribute('hidden', hasApps)
}

function show(): void {
  if (!switcher || !rail) return
  rail.textContent = ''
  for (const id of getRecents()) {
    if (SP_APPS[id]) rail.appendChild(buildCard(id, false))
  }
  rail.appendChild(buildCard('terminal-blocked', true))
  updateEmptyState()
  switcher.hidden = false
  requestAnimationFrame(() => switcher?.classList.add('is-open'))
  switcher.querySelector<HTMLElement>('.sp-switcher-card-open')?.focus()
}

function hide(): void {
  if (!switcher) return
  switcher.classList.remove('is-open')
  switcher.hidden = true
}

function openSwitcher(): void {
  if (getMode() === 'switcher') return
  show()
  if (!setMode('switcher')) hide()
}

function closeToHome(): void {
  if (getMode() !== 'switcher') return
  hide()
  setMode('home')
}

export function setupSwitcher(): void {
  switcher = document.querySelector<HTMLElement>('.sp-switcher')
  rail = switcher?.querySelector<HTMLElement>('.sp-switcher-rail') ?? null
  if (!switcher || !rail) return

  on('open-switcher', () => openSwitcher())

  switcher.addEventListener('click', (e) => {
    if (e.target === switcher) closeToHome()
  })

  switcher.querySelector<HTMLElement>('.sp-switcher-killall')?.addEventListener('click', () => {
    const cards = Array.from(rail?.querySelectorAll<HTMLElement>('.sp-switcher-card:not([data-persistent])') ?? [])
    cards.forEach((card, i) => {
      setTimeout(() => killCard(card, -0.6), i * 40)
    })
    clearRecents()
    setTimeout(
      () => {
        showToast('メモリ640KBをすべて解放しました（もともと空いていました）')
        closeToHome()
      },
      cards.length * 40 + 350,
    )
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getMode() === 'switcher') closeToHome()
  })
}
