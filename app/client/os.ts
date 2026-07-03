// tomokiOS のクライアントサイド一式:
// ウィンドウ管理(ドラッグ・フォーカス・開閉)、時計、起動画面、
// ターミナル、ゴミ箱、右クリックメニュー、壁紙切替

const BOOT_DURATION_MS = 1700
const BOOT_FADE_MS = 400
const WALLPAPERS = ['', 'mint', 'sky', 'sakura'] as const
const WALLPAPER_STORAGE_KEY = 'tomokios-wallpaper'
const BOOT_SESSION_KEY = 'tomokios-booted'

const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let zCounter = 10

function focusWindow(win: HTMLElement): void {
  zCounter += 1
  win.style.zIndex = String(zCounter)
}

function openWindow(id: string): HTMLElement | null {
  const win = document.querySelector<HTMLElement>(`.os-window[data-window="${id}"]`)
  if (!win) return null

  win.classList.add('is-open')
  focusWindow(win)

  if (!isDesktopViewport()) {
    win.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }
  return win
}

// ===== ウィンドウ管理 =====
export function setupWindowManager(): void {
  // フォーカス(最前面へ)
  document.querySelectorAll<HTMLElement>('.os-window').forEach((win) => {
    win.addEventListener('pointerdown', () => focusWindow(win))
  })

  // 開く: data-open属性(アイコン・メニューバー・ウィンドウ内リンク)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const opener = target.closest<HTMLElement>('[data-open]')
    if (!opener) return

    const id = opener.getAttribute('data-open')
    if (!id) return

    e.preventDefault()
    openWindow(id)
  })

  // 閉じる
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const closer = target.closest<HTMLElement>('[data-close]')
    if (!closer) return

    closer.closest<HTMLElement>('.os-window')?.classList.remove('is-open')
  })

  setupDrag()
}

function setupDrag(): void {
  const desktop = document.querySelector<HTMLElement>('[data-desktop]')
  if (!desktop) return

  document.querySelectorAll<HTMLElement>('[data-drag-handle]').forEach((handle) => {
    handle.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!isDesktopViewport()) return
      if ((e.target as HTMLElement).closest('button')) return

      const win = handle.closest<HTMLElement>('.os-window')
      if (!win) return

      const desktopRect = desktop.getBoundingClientRect()
      const winRect = win.getBoundingClientRect()
      const offsetX = e.clientX - winRect.left
      const offsetY = e.clientY - winRect.top

      win.classList.add('is-dragging')
      handle.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        const left = ev.clientX - desktopRect.left - offsetX
        const top = ev.clientY - desktopRect.top - offsetY
        const maxLeft = desktopRect.width - 80
        const maxTop = desktopRect.height - 40
        win.style.left = `${Math.min(Math.max(left, 80 - winRect.width), maxLeft)}px`
        win.style.top = `${Math.min(Math.max(top, 0), maxTop)}px`
      }

      const onUp = () => {
        win.classList.remove('is-dragging')
        handle.removeEventListener('pointermove', onMove)
        handle.removeEventListener('pointerup', onUp)
        handle.removeEventListener('pointercancel', onUp)
      }

      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', onUp)
      handle.addEventListener('pointercancel', onUp)
    })
  })
}

// ===== メニューバーの時計 =====
export function setupClock(): void {
  const clock = document.getElementById('os-clock')
  if (!clock) return

  const tick = () => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    clock.textContent = `${hh}:${mm}`
  }
  tick()
  setInterval(tick, 10_000)
}

// ===== 起動画面 =====
export function setupBootScreen(): void {
  try {
    if (sessionStorage.getItem(BOOT_SESSION_KEY)) return
    sessionStorage.setItem(BOOT_SESSION_KEY, 'true')
  } catch {
    return
  }

  const boot = document.createElement('div')
  boot.className = 'os-boot'
  boot.setAttribute('role', 'status')
  boot.setAttribute('aria-label', 'tomokiOS 起動中')

  const logo = document.createElement('div')
  logo.className = 'os-boot-logo'
  logo.textContent = '⌘'

  const name = document.createElement('div')
  name.className = 'os-boot-name'
  name.textContent = 'tomokiOS'

  const bar = document.createElement('div')
  bar.className = 'os-boot-bar'
  const fill = document.createElement('div')
  fill.className = 'os-boot-bar-fill'
  bar.appendChild(fill)

  const log = document.createElement('div')
  log.className = 'os-boot-log'

  for (const el of [logo, name, bar, log]) {
    boot.appendChild(el)
  }
  document.body.appendChild(boot)

  const duration = prefersReducedMotion() ? 400 : BOOT_DURATION_MS
  const lines = ['メモリチェック... OK', 'なつかしさドライバ 読込中...', 'インフラ層... スキップ（苦手）', 'ようこそ！']
  lines.forEach((line, i) => {
    setTimeout(
      () => {
        log.textContent = line
      },
      (duration / lines.length) * i,
    )
  })

  setTimeout(() => {
    boot.classList.add('is-done')
    setTimeout(() => boot.remove(), BOOT_FADE_MS)
  }, duration)
}

// ===== ターミナル =====
const TERMINAL_WINDOWS = ['profile', 'products', 'network', 'terminal', 'trash', 'about'] as const

function runCommand(input: string): string[] {
  const cmd = input.trim()
  if (cmd === '') return []

  if (cmd === 'help') {
    return [
      'つかえるコマンド:',
      '  whoami        じぶんをたしかめる',
      '  ls            デスクトップをみる',
      '  ls products   プロダクトいちらん',
      '  open <なまえ>  ウィンドウをひらく',
      '  pwd / date / uptime / clear / exit',
    ]
  }
  if (cmd === 'whoami') return ['tomokisun']
  if (cmd === 'pwd') return ['/Users/tomokisun/homepage']
  if (cmd === 'date') return [new Date().toLocaleString('ja-JP')]
  if (cmd === 'uptime') return ['SINCE 2006 からずっと稼働中（たまに再起動）']
  if (cmd === 'ls') return ['プロフィール.txt  products/  ネットワーク  ゴミ箱  グッズ.url']
  if (cmd === 'ls products' || cmd === 'ls products/') {
    return [
      'NewMatch.app  BeMatch.app  CalculatorMultiple.app  Blackjack.app',
      'SuperNFT.app🔒  nererun.app  PokerONE.app🔒  （🔒 = 買収済み）',
    ]
  }
  if (cmd.startsWith('open ')) {
    const name = cmd
      .slice(5)
      .trim()
      .toLowerCase()
      .replace(/\.app$/, '')
    const alias: Record<string, string> = {
      newmatch: 'p-newmatch',
      bematch: 'p-bematch',
      calculatormultiple: 'p-calculatormultiple',
      blackjack: 'p-blackjack',
      supernft: 'p-supernft',
      nererun: 'p-nererun',
      pokerone: 'p-pokerone',
    }
    const id = alias[name] ?? (TERMINAL_WINDOWS.includes(name as (typeof TERMINAL_WINDOWS)[number]) ? name : null)
    if (id && openWindow(id)) return [`${name} をひらきました`]
    return [`open: ${name}: そのようなアプリはありません`]
  }
  if (cmd.startsWith('sudo')) {
    return ['tomokisun は sudoers ファイルに存在しません。', 'この事件は報告されます。（だれに？）']
  }
  if (cmd === 'rm -rf /' || cmd === 'rm -rf /*') return ['やめてください。']
  if (cmd.startsWith('rm')) return ['rm: 削除できません（ゴミ箱をご利用ください）']
  if (cmd === 'infra' || cmd.startsWith('kubectl') || cmd.startsWith('terraform')) {
    return ['segmentation fault（本人も苦手なので）']
  }
  if (cmd === 'exit' || cmd === 'logout') return ['ログアウトはできません。素通り禁止です。']

  return [`command not found: ${cmd.split(' ')[0]}（helpでいちらん表示）`]
}

export function setupTerminal(): void {
  const term = document.querySelector<HTMLElement>('[data-terminal]')
  if (!term) return

  const output = term.querySelector<HTMLElement>('[data-term-output]')
  const inputView = term.querySelector<HTMLElement>('[data-term-input]')
  if (!output || !inputView) return

  const input = document.createElement('input')
  input.type = 'text'
  input.autocapitalize = 'off'
  input.autocomplete = 'off'
  input.spellcheck = false
  input.setAttribute('aria-label', 'ターミナル入力')
  input.style.cssText = 'position:absolute;opacity:0;width:1px;height:1px;border:0;padding:0;'
  term.appendChild(input)

  term.addEventListener('click', () => input.focus())

  input.addEventListener('input', () => {
    inputView.textContent = input.value
  })

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const value = input.value
    input.value = ''
    inputView.textContent = ''

    if (value.trim() === 'clear') {
      output.textContent = ''
      return
    }

    const echo = document.createElement('div')
    const prompt = document.createElement('span')
    prompt.className = 'term-prompt'
    prompt.textContent = '$'
    echo.appendChild(prompt)
    echo.appendChild(document.createTextNode(` ${value}`))
    output.appendChild(echo)

    for (const line of runCommand(value)) {
      const el = document.createElement('div')
      el.textContent = line
      output.appendChild(el)
    }

    term.scrollTop = term.scrollHeight
  })
}

// ===== ゴミ箱 =====
export function setupTrash(): void {
  const message = document.querySelector<HTMLElement>('[data-trash-message]')
  if (!message) return

  document.querySelector('[data-trash-restore]')?.addEventListener('click', () => {
    message.textContent = '復元に失敗しました：本人がインフラを苦手としているため。'
  })

  document.querySelector('[data-trash-empty]')?.addEventListener('click', () => {
    message.textContent = 'infra.zip は削除できませんでした。思い出なので。'
  })
}

// ===== 壁紙 =====
function applyWallpaper(name: string): void {
  if (name) {
    document.documentElement.setAttribute('data-wallpaper', name)
  } else {
    document.documentElement.removeAttribute('data-wallpaper')
  }
  try {
    localStorage.setItem(WALLPAPER_STORAGE_KEY, name)
  } catch {
    // プライベートブラウジング等では保存しない
  }
}

export function restoreWallpaper(): void {
  try {
    const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY)
    if (saved && WALLPAPERS.includes(saved as (typeof WALLPAPERS)[number])) {
      applyWallpaper(saved)
    }
  } catch {
    // 取得できなければデフォルトのまま
  }
}

function cycleWallpaper(): void {
  const current = document.documentElement.getAttribute('data-wallpaper') ?? ''
  const index = WALLPAPERS.indexOf(current as (typeof WALLPAPERS)[number])
  applyWallpaper(WALLPAPERS[(index + 1) % WALLPAPERS.length] ?? '')
}

// ===== 右クリックメニュー =====
export function setupContextMenu(): void {
  let menu: HTMLElement | null = null

  const closeMenu = () => {
    menu?.remove()
    menu = null
  }

  const addItem = (parent: HTMLElement, label: string, action: () => void) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('role', 'menuitem')
    button.textContent = label
    button.addEventListener('click', () => {
      closeMenu()
      action()
    })
    parent.appendChild(button)
  }

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    closeMenu()

    menu = document.createElement('div')
    menu.className = 'os-context'
    menu.setAttribute('role', 'menu')

    addItem(menu, '壁紙を変更', cycleWallpaper)
    addItem(menu, 'ウィンドウを整列', () => {
      document.querySelectorAll<HTMLElement>('.os-window').forEach((win) => {
        win.style.left = ''
        win.style.top = ''
      })
    })
    menu.appendChild(document.createElement('hr'))
    addItem(menu, 'このOSについて', () => openWindow('about'))
    addItem(menu, '再起動', () => {
      try {
        sessionStorage.removeItem(BOOT_SESSION_KEY)
      } catch {
        // 消せなくても再読み込みはする
      }
      window.location.reload()
    })

    document.body.appendChild(menu)

    const rect = menu.getBoundingClientRect()
    const left = Math.min(e.clientX, window.innerWidth - rect.width - 8)
    const top = Math.min(e.clientY, window.innerHeight - rect.height - 8)
    menu.style.left = `${Math.max(left, 8)}px`
    menu.style.top = `${Math.max(top, 8)}px`
  })

  document.addEventListener('click', closeMenu)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })
}
