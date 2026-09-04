// 翻訳 / 辞書 / コンパス / 株価 / メッセージ / 電話 の中身。

import { showToast } from '../ui'
import { each, q } from './common'

const PHRASES: [RegExp, string][] = [
  [/一旦|いったん/, '直す気はあります（時期は未定）'],
  [/確認|かくにん/, 'これから調べます（見当はついていません）'],
  [/検討|けんとう/, 'やらない可能性がそこそこあります'],
  [/なるはや|至急|急ぎ/, '今日中とは言っていません'],
  [/インフラ/, '本人が苦手な層（ゴミ箱に3.2GB）'],
  [/簡単|かんたん/, '2日はかかります'],
  [/すぐ/, '3日はかかります'],
  [/たぶん|おそらく/, '根拠はありませんが、経験上そうです'],
  [/640|メモリ/, 'じゅうぶんです'],
  [/ちょっと/, '相当'],
]

function translate(text: string): string {
  const hit = PHRASES.find(([pattern]) => pattern.test(text))
  if (hit) return hit[1]
  if (!text.trim()) return '文を入れてください。空欄は翻訳しても空欄です。'
  return `${text.trim()}（意訳: たぶんそういうことです）`
}

function setupTranslate(): void {
  each<HTMLElement>('[data-translate]', (root) => {
    const input = q<HTMLTextAreaElement>(root, '[data-translate-input]')
    const out = q<HTMLElement>(root, '[data-translate-out]')
    const head = q<HTMLElement>(root, '.ak-translate-head')
    if (!input || !out) return

    const run = () => {
      out.textContent = translate(input.value)
    }
    q<HTMLButtonElement>(root, '[data-translate-run]')?.addEventListener('click', run)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run()
    })
    q<HTMLButtonElement>(root, '[data-translate-swap]')?.addEventListener('click', () => {
      if (!head) return
      const labels = head.querySelectorAll('span')
      const first = labels[0]
      const last = labels[2]
      if (first && last) {
        const tmp = first.textContent
        first.textContent = last.textContent
        last.textContent = tmp
      }
      out.textContent = '入れ替えました。エンジニア語から日本語への翻訳は、まだ精度が出ていません。'
    })
  })
}

function setupDictionary(): void {
  each<HTMLElement>('[data-dictionary]', (root) => {
    const input = q<HTMLInputElement>(root, '[data-dict-input]')
    const out = q<HTMLElement>(root, '[data-dict-result]')
    const scope = root.parentElement ?? root
    const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-dict-word]'))
    if (!out) return

    const show = (row: HTMLElement) => {
      const word = row.dataset.dictWord ?? ''
      const means = q<HTMLElement>(row, '.ak-list-desc')?.textContent ?? ''
      out.textContent = `${word} — ${means}`
    }

    for (const row of rows) row.addEventListener('click', () => show(row))

    input?.addEventListener('input', () => {
      const query = input.value.trim()
      if (!query) {
        out.textContent = `見出し語は${rows.length}語です。出典は本人の体感。`
        for (const row of rows) row.hidden = false
        return
      }
      let found = 0
      for (const row of rows) {
        const hit = (row.dataset.dictWord ?? '').includes(query) || (row.textContent ?? '').includes(query)
        row.hidden = !hit
        if (hit) found += 1
      }
      out.textContent = found ? `${found}件みつかりました。` : `「${query}」は載っていません。造語の可能性があります。`
    })
  })
}

const DIRECTIONS = [
  [0, '北'],
  [45, '北東'],
  [90, '東'],
  [135, '南東'],
  [180, '南'],
  [225, '南西'],
  [270, '西'],
  [315, '北西'],
] as const

function setupCompass(): void {
  each<HTMLElement>('[data-compass]', (root) => {
    const dial = q<HTMLElement>(root, '[data-compass-dial]')
    const read = q<HTMLElement>(root, '[data-compass-read]')
    let turn = 0
    q<HTMLButtonElement>(root, '[data-compass-spin]')?.addEventListener('click', () => {
      turn += 1
      const pick = DIRECTIONS[turn % DIRECTIONS.length]
      if (!pick) return
      const [deg, label] = pick
      if (dial) dial.style.transform = `rotate(${-deg - turn * 360}deg)`
      if (read) read.textContent = `${deg}° ${label}`
      if (turn === 3) showToast('だいたい合っています。磁気センサーはありません。')
    })
  })
}

/** 株価: 表示中だけ小さく揺らす（架空の市場なので、値動きも架空） */
function setupStocks(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-stocks]')
  if (!roots.length) return
  setInterval(() => {
    roots.forEach((root) => {
      root.querySelectorAll<HTMLElement>('[data-stock-price]').forEach((cell) => {
        const current = Number(cell.textContent?.replace(/,/g, '') ?? 0)
        if (!current) return
        const next = current * (1 + (Math.random() - 0.5) * 0.004)
        cell.textContent = next >= 1000 ? next.toLocaleString('ja-JP', { maximumFractionDigits: 1 }) : next.toFixed(1)
      })
    })
  }, 3200)
}

const REPLIES: [RegExp, string][] = [
  [/こんにち|はじめ|hello|hi/i, 'はじめまして。ここは640KBで動いているOSです。'],
  [/インフラ/, 'にがてです。ゴミ箱に infra.zip として3.2GB残っています。'],
  [/おすすめ|アプリ/, 'ターミナルで help と打ってみてください。あとフリーボードは無限に時間が溶けます。'],
  [/640/, 'じゅうぶんです。ずっとそう言われてきました。'],
  [/仕事|会社|ONE/, 'ONE, Inc. で10代向けのアプリを作っています。共同創業です。'],
  [/ブログ|記事/, 'いまは1記事だけあります。2記事目は書けたら書きます。'],
  [/すごい|good|いいね/, 'ありがとうございます。夜に作っています。'],
  [/\?|？/, 'いい質問です。答えは、たぶんターミナルの中にあります。'],
]

function reply(text: string): string {
  const hit = REPLIES.find(([pattern]) => pattern.test(text))
  if (hit) return hit[1]
  return 'なるほど。……本人は寝ているので、これ以上のことは言えません。'
}

function setupMessages(): void {
  each<HTMLElement>('[data-messages-thread]', (thread) => {
    const root = thread.closest<HTMLElement>('.ak-messages') ?? thread.parentElement
    if (!root) return
    const form = q<HTMLFormElement>(root, '[data-messages-form]')
    const input = q<HTMLInputElement>(root, '[data-messages-input]')

    const add = (from: 'me' | 'them', text: string) => {
      const bubble = document.createElement('div')
      bubble.className = `ak-bubble ak-bubble--${from}`
      bubble.textContent = text
      thread.appendChild(bubble)
      thread.scrollTop = thread.scrollHeight
    }

    const send = (text: string) => {
      const message = text.trim()
      if (!message) return
      add('me', message)
      const typing = document.createElement('div')
      typing.className = 'ak-bubble ak-bubble--them is-typing'
      typing.textContent = '…'
      thread.appendChild(typing)
      thread.scrollTop = thread.scrollHeight
      setTimeout(() => {
        typing.remove()
        add('them', reply(message))
      }, 700)
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      if (!input) return
      send(input.value)
      input.value = ''
    })

    root.querySelectorAll<HTMLElement>('[data-messages-quick]').forEach((chip) => {
      chip.addEventListener('click', () => send(chip.dataset.messagesQuick ?? ''))
    })
  })
}

function setupKeypad(): void {
  each<HTMLElement>('[data-keypad]', (root) => {
    const display = q<HTMLElement>(root, '[data-keypad-display]')
    if (!display) return
    let value = ''
    const render = () => {
      display.textContent = value || ' '
    }

    root.querySelectorAll<HTMLElement>('[data-keypad-key]').forEach((key) => {
      key.addEventListener('click', () => {
        if (value.length >= 12) return
        value += key.dataset.keypadKey ?? ''
        render()
      })
    })
    q<HTMLButtonElement>(root, '[data-keypad-del]')?.addEventListener('click', () => {
      value = value.slice(0, -1)
      render()
    })
    q<HTMLButtonElement>(root, '[data-keypad-call]')?.addEventListener('click', () => {
      if (value === '640') {
        showToast('☎️ もしもし。640KBあればじゅうぶんです。')
      } else if (!value) {
        showToast('番号を入力してください。心当たりがなければ 640 をどうぞ。')
      } else {
        showToast(`${value} におかけになりましたが、この番号は使われていません。`)
      }
      value = ''
      render()
    })
  })
}

export function setupLifeApps(): void {
  setupTranslate()
  setupDictionary()
  setupCompass()
  setupStocks()
  setupMessages()
  setupKeypad()
}
