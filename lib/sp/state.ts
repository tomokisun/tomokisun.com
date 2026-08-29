// tomokiOS SP 状態機械
// `.sp-shell` の data-sp-mode 属性が唯一の真実。setMode() 一箇所で遷移する。
//
// z-index台帳:
//   app-view 900 / statusbar・dock 1000 / indicator 1001 / os-toast 1200 /
//   notification 1300 / cc・switcher 1400 / sp-dialog 2000 /
//   screen-filter 4000 (pointer-events:none) / lockscreen 5000

export type SpMode = 'locked' | 'home' | 'app' | 'switcher' | 'cc' | 'edit'

const ALLOWED: Record<SpMode, SpMode[]> = {
  locked: ['home'],
  home: ['app', 'edit', 'cc', 'switcher'],
  app: ['home', 'switcher', 'cc', 'app'],
  switcher: ['app', 'home'],
  cc: ['locked', 'home', 'app', 'edit', 'switcher'],
  edit: ['home', 'cc', 'app'], // edit→appは通知タップ用（ホームアイコンからの起動はapps.ts側で抑止）
}

let shell: HTMLElement | null = null
let mode: SpMode = 'home'
let prevMode: SpMode = 'home'
let activeApp: string | null = null
const recentApps: string[] = []
const MAX_RECENTS = 4

type Listener = (payload?: unknown) => void
const listeners = new Map<string, Set<Listener>>()

export function on(name: string, fn: Listener): void {
  let set = listeners.get(name)
  if (!set) {
    set = new Set()
    listeners.set(name, set)
  }
  set.add(fn)
}

export function emit(name: string, payload?: unknown): void {
  listeners.get(name)?.forEach((fn) => {
    fn(payload)
  })
}

function setInert(selector: string, inert: boolean): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.inert = inert
  })
}

function applyInert(next: SpMode): void {
  // inert対象はここに一元管理する（散らばると必ず漏れる）
  const homeChrome = '.sp-home, .sp-dock'
  const statusbar = '.sp-statusbar'
  const appViews = '.sp-app-view'

  setInert(homeChrome, next === 'app' || next === 'switcher' || next === 'cc' || next === 'locked')
  setInert(statusbar, next === 'switcher' || next === 'cc' || next === 'locked')
  setInert(appViews, next === 'cc' || next === 'locked')
  setInert('.sp-cc', next !== 'cc')
  setInert('.sp-switcher', next !== 'switcher')
  setInert('.sp-lockscreen', next !== 'locked')
}

export function initState(shellEl: HTMLElement, initial: SpMode): void {
  shell = shellEl
  mode = initial
  prevMode = initial
  shell.setAttribute('data-sp-mode', initial)
  applyInert(initial)
}

export function getMode(): SpMode {
  return mode
}

export function getPrevMode(): SpMode {
  return prevMode
}

export function setMode(next: SpMode): boolean {
  if (!shell || next === mode) return false
  if (!ALLOWED[mode].includes(next)) return false
  prevMode = mode
  mode = next
  shell.setAttribute('data-sp-mode', next)
  applyInert(next)
  emit('mode', { prev: prevMode, next })
  return true
}

export function getActiveApp(): string | null {
  return activeApp
}

export function setActiveApp(id: string | null): void {
  activeApp = id
}

export function pushRecent(id: string): void {
  const index = recentApps.indexOf(id)
  if (index !== -1) recentApps.splice(index, 1)
  recentApps.unshift(id)
  if (recentApps.length > MAX_RECENTS) recentApps.pop()
}

export function removeRecent(id: string): void {
  const index = recentApps.indexOf(id)
  if (index !== -1) recentApps.splice(index, 1)
}

export function clearRecents(): void {
  recentApps.length = 0
}

export function getRecents(): string[] {
  return [...recentApps]
}
