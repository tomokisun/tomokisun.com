// 表計算 / 文書・テキストエディット / スライド / フリーボード / ジャーナル の中身。
// 「書けるが残らない」はメモ帳と同じ。保存はメモリ上だけ。

import { each, q } from './common'

function setupSheets(): void {
  each<HTMLElement>('[data-sheet]', (sheet) => {
    const cells = Array.from(sheet.querySelectorAll<HTMLInputElement>('[data-sheet-cell]'))
    const totals = Array.from(sheet.querySelectorAll<HTMLElement>('[data-sheet-total]'))

    const recalc = () => {
      for (const total of totals) {
        const column = Number(total.dataset.sheetTotal ?? 0)
        const sum = cells
          .filter((_, i) => i % totals.length === column)
          .reduce((acc, cell) => acc + (Number(cell.value.replace(/[^\d.-]/g, '')) || 0), 0)
        total.textContent = sum.toLocaleString('ja-JP')
      }
    }

    for (const cell of cells) cell.addEventListener('input', recalc)
    recalc()
  })
}

function setupDocs(): void {
  each<HTMLTextAreaElement>('[data-doc]', (area) => {
    const name = area.dataset.doc ?? ''
    const scope = area.closest('.ak') ?? document
    const count = scope.querySelector<HTMLElement>(`[data-doc-count="${name}"]`)
    const render = () => {
      if (count) count.textContent = `${area.value.length}文字`
    }
    area.addEventListener('input', render)
    render()
  })
}

const SLIDES = [
  ['tomokiOS 26', '素通り禁止オペレーティングシステム'],
  ['課題', 'ホームページは、だいたい素通りされる'],
  ['解決', 'OSにしてしまえば、触ってもらえる'],
  ['技術', 'Next.js + OpenNext / Cloudflare Workers'],
  ['必要メモリ', '640KB'],
]

function setupSlides(): void {
  each<HTMLElement>('[data-slides]', (root) => {
    const title = q<HTMLElement>(root, '[data-slide-title]')
    const body = q<HTMLElement>(root, '[data-slide-body]')
    const no = q<HTMLElement>(root, '[data-slide-no]')
    const scope = root.parentElement ?? root
    let index = 0

    const render = () => {
      const slide = SLIDES[index]
      if (!slide) return
      if (title) title.textContent = slide[0] ?? ''
      if (body) body.textContent = slide[1] ?? ''
      if (no) no.textContent = `${index + 1} / ${SLIDES.length}`
      scope.querySelectorAll<HTMLElement>('[data-slide-go]').forEach((row) => {
        row.classList.toggle('is-playing', Number(row.dataset.slideGo) === index)
      })
    }

    const go = (next: number) => {
      index = (next + SLIDES.length) % SLIDES.length
      render()
    }

    q<HTMLButtonElement>(root, '[data-slide-prev]')?.addEventListener('click', () => go(index - 1))
    q<HTMLButtonElement>(root, '[data-slide-next]')?.addEventListener('click', () => go(index + 1))
    scope.querySelectorAll<HTMLElement>('[data-slide-go]').forEach((row) => {
      row.addEventListener('click', () => go(Number(row.dataset.slideGo ?? 0)))
    })
    render()
  })
}

const INK: Record<string, string> = {
  ink: '#26233f',
  cherry: '#ff8fa3',
  soda: '#8fd6e8',
  melon: '#9fe6b8',
  cream: '#ffdf8a',
}

/** フリーボード: Pointer Eventsだけで描く。触感はSPのジェスチャーと同じ方針 */
function setupBoards(): void {
  each<HTMLElement>('[data-board]', (root) => {
    const canvas = q<HTMLCanvasElement>(root, '[data-board-canvas]')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let color = INK.ink ?? '#26233f'
    let drawing = false

    const point = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      }
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 6

    canvas.addEventListener('pointerdown', (e) => {
      drawing = true
      canvas.setPointerCapture(e.pointerId)
      const { x, y } = point(e)
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
    })
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return
      const { x, y } = point(e)
      ctx.lineTo(x, y)
      ctx.stroke()
    })
    const end = () => {
      drawing = false
    }
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)

    root.querySelectorAll<HTMLElement>('[data-board-color]').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        color = INK[swatch.dataset.boardColor ?? 'ink'] ?? '#26233f'
        for (const el of root.querySelectorAll('[data-board-color]')) el.classList.remove('is-active')
        swatch.classList.add('is-active')
      })
    })
    q<HTMLButtonElement>(root, '[data-board-clear]')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })
  })
}

function setupJournal(): void {
  each<HTMLElement>('[data-journal]', (root) => {
    const form = q<HTMLFormElement>(root, '[data-journal-form]')
    const input = q<HTMLInputElement>(root, '[data-journal-input]')
    const list = q<HTMLElement>(root, '[data-journal-list]')
    if (!form || !list) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const text = input?.value.trim()
      if (!text) return
      const now = new Date()
      const li = document.createElement('li')
      li.className = 'ak-journal-entry is-new'
      const date = document.createElement('span')
      date.className = 'ak-journal-date'
      date.textContent = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
      const body = document.createElement('span')
      body.className = 'ak-journal-text'
      body.textContent = text
      li.append(date, body)
      list.prepend(li)
      if (input) input.value = ''
    })
  })
}

export function setupWorkApps(): void {
  setupSheets()
  setupDocs()
  setupSlides()
  setupBoards()
  setupJournal()
}
