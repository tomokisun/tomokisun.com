// tomokiOS 26 "Cream Soda" クライアントサイドロジック
// PCモード: ウィンドウ管理・ドラッグ・ターミナル・コンテキストメニュー
// SPモード: lib/sp/ 配下（ロック画面・アプリ開閉・ジェスチャー・コントロールセンター等）

import { blogPosts, formatPostDate } from '@/data/blog-posts'
import { evaluateExpression, setupCalculators } from './apps/calculator'
import { setupNotepads } from './apps/notepad'
import { initSp } from './sp'

const BOOT_DURATION_MS = 1800
const BOOT_FADE_MS = 400
const WALLPAPERS = ['', 'melon', 'ichigo', 'yozora', 'classic'] as const
const WALLPAPER_STORAGE_KEY = 'tomokios-wallpaper'
const BOOT_SESSION_KEY = 'tomokios-booted'

const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ===== PC: ウィンドウ管理 =====
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
  return win
}

function closeWindow(win: HTMLElement): void {
  win.classList.remove('is-open')
}

export function setupWindowManager(): void {
  // フォーカス
  document.querySelectorAll<HTMLElement>('.os-window').forEach((win) => {
    win.addEventListener('pointerdown', () => focusWindow(win))
  })

  // 開く: data-open属性
  document.addEventListener('click', (e) => {
    const opener = (e.target as HTMLElement).closest<HTMLElement>('[data-open]')
    if (!opener) return
    const id = opener.getAttribute('data-open')
    if (!id) return
    e.preventDefault()
    openWindow(id)
  })

  // 閉じる: data-close属性
  document.addEventListener('click', (e) => {
    const closer = (e.target as HTMLElement).closest<HTMLElement>('[data-close]')
    if (!closer) return
    const win = closer.closest<HTMLElement>('.os-window')
    if (win) closeWindow(win)
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

// ===== 時計 =====
export function setupClock(): void {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]')
  if (!clocks.length) return

  const tick = () => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const timeStr = `${hh}:${mm}`
    clocks.forEach((el) => {
      el.textContent = timeStr
    })
  }
  tick()
  setInterval(tick, 10_000)
}

// ===== 起動画面 (PC: BIOS風) =====
export function setupBootScreen(): void {
  // SPはロック画面だけを表示する（同じセッションキーの競合を避ける）
  if (!isDesktopViewport()) return

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
  logo.textContent = '🍈'

  const name = document.createElement('div')
  name.className = 'os-boot-name'
  name.textContent = 'tomokiOS 26'

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
  const lines = [
    'tomokiOS 26 (Build 2006A)',
    'メモリチェック ... 640KB OK（じゅうぶん）',
    'なつかしさドライバ ... 読込完了',
    'インフラ層 ... スキップ（苦手）',
    'ようこそ！',
  ]
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
const OPENABLE_WINDOWS = [
  'profile',
  'products',
  'social',
  'blog',
  'memo',
  'calc',
  'terminal',
  'trash',
  'about',
  'settings',
] as const

function runCommand(input: string): string[] {
  const cmd = input.trim()
  if (cmd === '') return []

  if (cmd === 'help') {
    return [
      'つかえるコマンド:',
      '  whoami        じぶんをたしかめる',
      '  ls            デスクトップをみる',
      '  ls products   プロダクトいちらん',
      '  blog          ブログをよむ',
      '  blog <なまえ>  きじをひらく（例: blog wablo）',
      '  calc <しき>    かんたんな計算（電卓もあります）',
      '  memo          メモ帳をひらく',
      '  open <なまえ>  ウィンドウをひらく',
      '  neofetch      システム情報',
      '  pwd / date / uptime / clear / exit',
      '  history / credits / coffee',
    ]
  }
  if (cmd === 'whoami') return ['tomokisun']
  if (cmd === 'pwd') return ['/Users/tomokisun/homepage']
  if (cmd === 'date') return [new Date().toLocaleString('ja-JP')]
  if (cmd === 'uptime') return ['SINCE 2006 からずっと稼働中（たまに再起動）']
  if (cmd === 'ls') {
    return ['プロフィール.txt  メモ.txt  Products/  ソーシャル  blog/  電卓.app  ゴミ箱  設定  グッズ.url']
  }
  if (cmd === 'ls blog' || cmd === 'ls blog/') {
    return [...blogPosts.map((post) => `${post.date}-${post.slug}.md`), '（つづきは blog コマンドでどうぞ）']
  }
  if (cmd === 'blog') {
    openWindow('blog')
    return [
      'ブログをひらきました',
      ...blogPosts.map((post) => `  ${formatPostDate(post.date)}  ${post.title} — ${post.slug}.md`),
      'きじは `blog <なまえ>` でもひらけます。',
    ]
  }
  if (cmd.startsWith('blog ')) {
    const slug = cmd.slice(5).trim().toLowerCase().replace(/\.md$/, '')
    if (blogPosts.some((post) => post.slug === slug) && openWindow(`blog-${slug}`)) {
      return [`${slug}.md をひらきました`]
    }
    return [`blog: ${slug}: そのようなきじはありません（blog でいちらん）`]
  }
  if (cmd === 'memo' || cmd === 'notepad') {
    openWindow('memo')
    return ['メモ帳をひらきました。保存はできます（残りません）。']
  }
  if (cmd === 'calc' || cmd === 'bc') {
    openWindow('calc')
    return ['電卓をひらきました。`calc 640+0` のように式を渡すこともできます。']
  }
  if (cmd.startsWith('calc ')) return evaluateExpression(cmd.slice(5))
  if (cmd.startsWith('cat')) {
    const post = blogPosts.find((entry) => cmd.includes(entry.slug))
    if (post) {
      openWindow(`blog-${post.slug}`)
      return [`${post.slug}.md をひらきました。30秒では読み終わりません。`]
    }
    if (cmd.includes('メモ') || cmd.includes('memo')) {
      openWindow('memo')
      return ['メモ.txt はメモリ上にしかありません。メモ帳をひらきました。']
    }
    return ['cat: そのようなファイルはありません（ブログにはあります）']
  }
  if (cmd === 'ls products' || cmd === 'ls products/') {
    return [
      'NewMatch.app  BeMatch.app  CalculatorMultiple.app  Blackjack.app',
      'SuperNFT.app🔒  nererun.app  PokerONE.app🔒  （🔒 = 買収済み）',
    ]
  }
  if (cmd === 'neofetch') {
    return [
      '        🍈         tomokisun@tomokibook',
      '      🍈🍈🍈       ──────────────────────',
      '    🍈🍈🍈🍈🍈     OS: tomokiOS 26 "Cream Soda"',
      '      🍈🍈🍈       Host: tomokiBook',
      '        🍈         Uptime: since 2006',
      '                   Memory: 640KB (じゅうぶん)',
      '                   Shell: zsh (実権限なし)',
      '                   DE: Cream Soda Desktop',
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
      memo: 'memo',
      notepad: 'memo',
      メモ帳: 'memo',
      メモ: 'memo',
      calc: 'calc',
      calculator: 'calc',
      電卓: 'calc',
      profile: 'profile',
      products: 'products',
      social: 'social',
      blog: 'blog',
      terminal: 'terminal',
      trash: 'trash',
      settings: 'settings',
      about: 'about',
    }
    // 記事ウィンドウ（blog-<slug>）は data から自動で引けるようにする
    for (const post of blogPosts) alias[post.slug] = `blog-${post.slug}`
    const id = alias[name] ?? (OPENABLE_WINDOWS.includes(name as (typeof OPENABLE_WINDOWS)[number]) ? name : null)
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
  if (cmd === 'vim') return ['vimに入りました。抜けるには :q! を入力してください（本人も昔ハマりました）']
  if (cmd === ':q!' || cmd === ':q') return ['vimを抜けました。おつかれさまでした。']
  if (cmd === 'history') return ['  1  help', '  2  whoami', '  3  rm -rf /', '  4  ごめんなさい']
  if (cmd === 'credits') {
    return [
      '── tomokiOS 26 Credits ──',
      'Design & Code: tomokisun',
      'Framework: Next.js + OpenNext',
      'Infra: Cloudflare Workers（本人の代わりに）',
      'Font: DotGothic16',
      '── ありがとうございました ──',
    ]
  }
  if (cmd === 'coffee' || cmd === 'brew install coffee') {
    return ['☕ を淹れています... 完了。画面から取り出してください。']
  }
  if (cmd.startsWith('ping')) {
    return [
      '64 bytes: ttl=64 time=0.1ms（社内なので）',
      '64 bytes: ttl=64 time=0.2ms',
      '64 bytes: ttl=64 time=0.1ms',
      '--- ping statistics: だいたい良好 ---',
    ]
  }
  if (cmd === 'npm install') {
    return ['added 847 packages in 12s', 'node_modules (1.2GB) … やっぱりやめておきますね']
  }
  if (cmd.startsWith('say')) return ['（このMacにスピーカーはありません）']

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
    prompt.textContent = 'tomokisun@tomokibook ~ %'
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
let trashAttempts = 0

export function setupTrash(): void {
  const message = document.querySelector<HTMLElement>('[data-trash-message]')
  if (!message) return

  document.querySelector('[data-trash-restore]')?.addEventListener('click', () => {
    trashAttempts++
    if (trashAttempts >= 3) {
      message.textContent = '発掘: kubectl.exe（未使用）、terraform入門.pdf（1ページ目まで読了）'
    } else {
      message.textContent = '復元に失敗しました：本人がインフラを苦手としているため。'
    }
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
  } catch {}
}

export function restoreWallpaper(): void {
  try {
    const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY)
    if (saved && WALLPAPERS.includes(saved as (typeof WALLPAPERS)[number])) {
      applyWallpaper(saved)
    }
  } catch {}
}

export function cycleWallpaper(): void {
  const current = document.documentElement.getAttribute('data-wallpaper') ?? ''
  const index = WALLPAPERS.indexOf(current as (typeof WALLPAPERS)[number])
  applyWallpaper(WALLPAPERS[(index + 1) % WALLPAPERS.length] ?? '')
}

const WALLPAPER_LABELS: Record<(typeof WALLPAPERS)[number], string> = {
  '': 'ソーダ',
  melon: 'メロン',
  ichigo: 'いちご',
  yozora: 'よぞら',
  classic: 'クラシック',
}

export function getWallpaperLabel(): string {
  const current = (document.documentElement.getAttribute('data-wallpaper') ?? '') as (typeof WALLPAPERS)[number]
  return WALLPAPER_LABELS[current] ?? 'ソーダ'
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
    if (!(e.target as HTMLElement).closest('[data-desktop]')) return
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
      } catch {}
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

// ===== タブ離脱検知 =====
export function setupTabTitle(): void {
  const originalTitle = document.title
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '⚠ 作業中のまま放置されています' : originalTitle
  })
}

// ===== メイン初期化 =====
export function initOS(): void {
  restoreWallpaper()
  setupBootScreen()
  setupWindowManager()
  setupClock()
  setupTerminal()
  setupNotepads()
  setupCalculators()
  setupTrash()
  setupContextMenu()
  setupTabTitle()
  if (!isDesktopViewport()) initSp()
}
