// グラフ計算機 / ポーカー / ショートカット / 拡大鏡 / アクティビティモニタ の中身。

import { runCommand } from '../os/terminal'
import { showToast } from '../ui'
import { each, q } from './common'

// ===== グラフ計算機 =====
const FUNCS: Record<string, { fn: (x: number) => number; note: string }> = {
  sin: { fn: (x) => Math.sin(x), note: 'y = sin x ｜ 気分の上下です。周期は約1日。' },
  quad: { fn: (x) => (x * x) / 4, note: 'y = x² / 4 ｜ 締切前の作業量です。' },
  exp: { fn: (x) => 2 ** x / 8, note: 'y = 2^x / 8 ｜ 技術的負債です。放置すると立ち上がります。' },
  decay: {
    fn: (x) => (x === 0 ? Number.NaN : 4 / x),
    note: 'y = 4 / x ｜ やる気です。0に近づくほど手がつけられません。',
  },
}

function setupGrapher(): void {
  each<HTMLElement>('[data-grapher]', (root) => {
    const line = q<SVGPolylineElement & HTMLElement>(root, '[data-graph-line]')
    const note = q<HTMLElement>(root, '[data-graph-note]')
    if (!line) return

    const draw = (key: string) => {
      const entry = FUNCS[key]
      if (!entry) return
      const points: string[] = []
      for (let x = -6; x <= 6; x += 0.1) {
        const y = entry.fn(x)
        if (!Number.isFinite(y) || Math.abs(y) > 4) continue
        points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
      }
      line.setAttribute('points', points.join(' '))
      if (note) note.textContent = entry.note
    }

    root.querySelectorAll<HTMLElement>('[data-graph-fn]').forEach((chip) => {
      chip.addEventListener('click', () => {
        for (const el of root.querySelectorAll('[data-graph-fn]')) el.classList.remove('is-active')
        chip.classList.add('is-active')
        draw(chip.dataset.graphFn ?? 'sin')
      })
    })
    draw('sin')
  })
}

// ===== ポーカー =====
const SUITS = ['♠', '♥', '♦', '♣']
const RANK_LABELS: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }

type Card = { rank: number; suit: number }

function deck(): Card[] {
  const cards: Card[] = []
  for (let suit = 0; suit < 4; suit++) for (let rank = 2; rank <= 14; rank++) cards.push({ rank, suit })
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = cards[i]
    const b = cards[j]
    if (a && b) {
      cards[i] = b
      cards[j] = a
    }
  }
  return cards
}

const label = (card: Card) => `${RANK_LABELS[card.rank] ?? card.rank}${SUITS[card.suit]}`

function hasStraight(ranks: number[]): boolean {
  const set = new Set(ranks)
  if (set.has(14)) set.add(1)
  const sorted = [...set].sort((a, b) => b - a)
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const cur = sorted[i]
    if (prev === undefined || cur === undefined) continue
    run = prev - cur === 1 ? run + 1 : 1
    if (run >= 5) return true
  }
  return false
}

/** 7枚から役名を返す。順位の細かい比較はしない（相手がいないので） */
function handName(cards: Card[]): string {
  const ranks = cards.map((c) => c.rank)
  const counts = new Map<number, number>()
  for (const rank of ranks) counts.set(rank, (counts.get(rank) ?? 0) + 1)
  const groups = [...counts.values()].sort((a, b) => b - a)

  const bySuit = new Map<number, number[]>()
  for (const card of cards) bySuit.set(card.suit, [...(bySuit.get(card.suit) ?? []), card.rank])
  const flushRanks = [...bySuit.values()].find((list) => list.length >= 5)

  if (flushRanks && hasStraight(flushRanks)) {
    return flushRanks.includes(14) && flushRanks.includes(13) ? 'ロイヤルフラッシュ' : 'ストレートフラッシュ'
  }
  if (groups[0] === 4) return 'フォーカード'
  if (groups[0] === 3 && (groups[1] ?? 0) >= 2) return 'フルハウス'
  if (flushRanks) return 'フラッシュ'
  if (hasStraight(ranks)) return 'ストレート'
  if (groups[0] === 3) return 'スリーカード'
  if (groups[0] === 2 && groups[1] === 2) return 'ツーペア'
  if (groups[0] === 2) return 'ワンペア'
  return 'ハイカード'
}

const QUIPS: Record<string, string> = {
  ロイヤルフラッシュ: '一生に一度です。スクリーンショットをどうぞ。',
  ストレートフラッシュ: '出来すぎです。乱数を疑ってもいいレベルです。',
  フォーカード: '強すぎて、賭ける相手がいないのが惜しい。',
  フルハウス: '手堅い。本人の開発スタイルに似ています。',
  フラッシュ: 'そろいました。色だけで押し切るタイプ。',
  ストレート: 'つながりました。設計もこれくらい素直だといい。',
  スリーカード: 'そこそこです。降りる理由はありません。',
  ツーペア: '悪くない。でも、もう1枚ほしい。',
  ワンペア: 'いちばんよく出る役です。人生と同じ。',
  ハイカード: '何もありません。フォールドで学びましょう。',
}

function setupHoldem(): void {
  each<HTMLElement>('[data-holdem]', (root) => {
    const board = q<HTMLElement>(root, '[data-holdem-board]')
    const hand = q<HTMLElement>(root, '[data-holdem-hand]')
    const status = q<HTMLElement>(root, '[data-holdem-status]')
    if (!board || !hand) return

    const paint = (target: HTMLElement, cards: Card[]) => {
      target.textContent = ''
      for (const card of cards) {
        const el = document.createElement('span')
        el.className = `ak-card-face${card.suit === 1 || card.suit === 2 ? ' is-red' : ''}`
        el.textContent = label(card)
        target.appendChild(el)
      }
    }

    q<HTMLButtonElement>(root, '[data-holdem-deal]')?.addEventListener('click', () => {
      const cards = deck()
      const hole = cards.slice(0, 2)
      const community = cards.slice(2, 7)
      paint(hand, hole)
      paint(board, community)
      const name = handName([...hole, ...community])
      if (status) status.textContent = `${name} ｜ チップ 640（減りません）`
      showToast(`${name}。${QUIPS[name] ?? ''}`)
    })

    q<HTMLButtonElement>(root, '[data-holdem-fold]')?.addEventListener('click', () => {
      if (status) status.textContent = 'フォールドしました ｜ チップ 640（減りません）'
      showToast('降りました。降りるのも技術です。チップは640のままです。')
    })
  })
}

// ===== ショートカット =====
function setupShortcuts(): void {
  each<HTMLElement>('[data-shortcut]', (tile) => {
    tile.addEventListener('click', () => {
      const cmd = tile.dataset.shortcut ?? ''
      const lines = runCommand(cmd)
      const scope = tile.closest('.ak')
      const out = scope?.querySelector<HTMLElement>('[data-shortcut-out]')
      if (out) {
        out.hidden = false
        const pre = document.createElement('pre')
        pre.className = 'ak-console'
        for (const line of lines) {
          const div = document.createElement('div')
          div.textContent = line || ' '
          pre.appendChild(div)
        }
        out.textContent = ''
        out.appendChild(pre)
      }
      showToast(`$ ${cmd} を実行しました。`)
    })
  })
}

// ===== 拡大鏡 =====
function setupMagnifier(): void {
  each<HTMLElement>('[data-magnifier]', (root) => {
    const sample = q<HTMLElement>(root, '[data-magnifier-sample]')
    const slider = q<HTMLInputElement>(root, '[data-magnifier-zoom]')
    const value = q<HTMLElement>(root, '[data-magnifier-value]')
    if (!sample || !slider) return
    const render = () => {
      const zoom = Number(slider.value) / 100
      sample.style.fontSize = `${zoom * 13}px`
      if (value) value.textContent = `${zoom.toFixed(1)}×`
    }
    slider.addEventListener('input', render)
    render()
  })
}

// ===== アクティビティモニタ =====
function setupActivity(): void {
  const graphs = document.querySelectorAll<SVGPolylineElement>('[data-activity-graph] polyline')
  if (!graphs.length) return
  const points: number[] = [8, 14, 9, 22, 12, 30, 11, 16, 10]
  setInterval(() => {
    points.shift()
    points.push(4 + Math.random() * 30)
    const max = Math.max(...points)
    const min = Math.min(...points)
    const span = max - min || 1
    const step = 100 / (points.length - 1)
    const d = points.map((p, i) => `${i * step},${34 - ((p - min) / span) * 30}`).join(' ')
    for (const graph of graphs) graph.setAttribute('points', d)
  }, 1400)
}

export function setupDevApps(): void {
  setupGrapher()
  setupHoldem()
  setupShortcuts()
  setupMagnifier()
  setupActivity()
}
