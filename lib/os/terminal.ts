// ターミナル。コマンドは runCommand() 1本にまとめてあるので、
// ショートカットアプリからも同じ関数を呼べる（結果の文字列配列が返る）。

import { apps, findApp } from '@/data/apps'
import { blogPosts, formatPostDate } from '@/data/blog-posts'
import { evaluateExpression } from '../apps/calculator'
import { openWindow } from './windows'

/** open <name> で使う別名。レジストリから自動で作り、手書きの読みだけ足す */
function buildAliases(): Record<string, string> {
  const alias: Record<string, string> = {}
  for (const app of apps) {
    alias[app.id] = app.id
    alias[app.name.toLowerCase()] = app.id
    for (const keyword of app.keywords ?? []) alias[keyword.toLowerCase()] = app.id
  }
  for (const post of blogPosts) alias[post.slug] = `blog-${post.slug}`
  alias.newmatch = 'p-newmatch'
  alias.bematch = 'p-bematch'
  alias.calculatormultiple = 'p-calculatormultiple'
  alias.blackjack = 'p-blackjack'
  alias.supernft = 'p-supernft'
  alias.nererun = 'p-nererun'
  alias.pokerone = 'p-pokerone'
  return alias
}

let aliases: Record<string, string> | null = null

export function runCommand(input: string): string[] {
  const cmd = input.trim()
  if (cmd === '') return []
  aliases ??= buildAliases()

  if (cmd === 'help') {
    return [
      'つかえるコマンド:',
      '  whoami        じぶんをたしかめる',
      '  ls            デスクトップをみる',
      '  ls apps       入っているアプリぜんぶ',
      '  ls products   プロダクトいちらん',
      '  blog          ブログをよむ',
      '  blog <なまえ>  きじをひらく（例: blog wablo）',
      '  calc <しき>    かんたんな計算（電卓もあります）',
      '  open <なまえ>  アプリをひらく（例: open 時計 / open xcode）',
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
  if (cmd === 'ls apps' || cmd === 'ls /Applications') {
    const lines: string[] = [`${apps.length} 個のアプリがインストールされています:`]
    for (let i = 0; i < apps.length; i += 4) {
      lines.push(
        `  ${apps
          .slice(i, i + 4)
          .map((app) => `${app.name}.app`)
          .join('  ')}`,
      )
    }
    lines.push('（`open <なまえ>` でひらけます）')
    return lines
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
      `                   Apps: ${apps.length} 個（ぜんぶプリインストール）`,
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
    const id = aliases[name]
    if (id && openWindow(id)) return [`${findApp(id)?.name ?? name} をひらきました`]
    return [`open: ${name}: そのようなアプリはありません（ls apps でいちらん）`]
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
