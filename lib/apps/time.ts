// 時計 / カレンダー / リマインダー の中身。
// 「本当に動く」ことがこのOSの数少ないまじめな部分なので、ここだけは正確に。

import { showToast } from '../ui'
import { each, pad2, q } from './common'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

/** 世界時計: 実際のタイムゾーンで現在時刻を出す */
function setupWorldClocks(): void {
  const cells = document.querySelectorAll<HTMLElement>('[data-clock-tz]')
  if (!cells.length) return
  const tick = () => {
    for (const cell of cells) {
      const tz = cell.dataset.clockTz
      if (!tz) continue
      try {
        cell.textContent = new Intl.DateTimeFormat('ja-JP', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      } catch {
        cell.textContent = '--:--'
      }
    }
  }
  tick()
  setInterval(tick, 15_000)
}

function setupStopwatches(): void {
  each<HTMLElement>('[data-stopwatch]', (root) => {
    const display = q<HTMLElement>(root, '[data-sw-display]')
    const toggle = q<HTMLButtonElement>(root, '[data-sw-toggle]')
    const lapBtn = q<HTMLButtonElement>(root, '[data-sw-lap]')
    const resetBtn = q<HTMLButtonElement>(root, '[data-sw-reset]')
    const laps = q<HTMLElement>(root, '[data-sw-laps]')
    if (!display || !toggle) return

    let running = false
    let base = 0
    let elapsed = 0
    let raf = 0

    const format = (ms: number) => `${pad2(ms / 60000)}:${pad2((ms % 60000) / 1000)}.${pad2((ms % 1000) / 10)}`

    const frame = () => {
      display.textContent = format(elapsed + (running ? performance.now() - base : 0))
      if (running) raf = requestAnimationFrame(frame)
    }

    toggle.addEventListener('click', () => {
      if (running) {
        elapsed += performance.now() - base
        running = false
        cancelAnimationFrame(raf)
        toggle.textContent = 'スタート'
      } else {
        base = performance.now()
        running = true
        toggle.textContent = 'ストップ'
        frame()
      }
      frame()
    })

    lapBtn?.addEventListener('click', () => {
      if (!laps) return
      const total = elapsed + (running ? performance.now() - base : 0)
      if (total === 0) {
        showToast('まだ0.00秒です。押すのが早すぎます。')
        return
      }
      const li = document.createElement('li')
      li.textContent = `ラップ ${laps.children.length + 1} ｜ ${format(total)}`
      laps.prepend(li)
    })

    resetBtn?.addEventListener('click', () => {
      running = false
      cancelAnimationFrame(raf)
      elapsed = 0
      display.textContent = '00:00.00'
      toggle.textContent = 'スタート'
      if (laps) laps.textContent = ''
    })
  })
}

function setupTimers(): void {
  each<HTMLElement>('[data-timer]', (root) => {
    const display = q<HTMLElement>(root, '[data-timer-display]')
    const toggle = q<HTMLButtonElement>(root, '[data-timer-toggle]')
    const reset = q<HTMLButtonElement>(root, '[data-timer-reset]')
    const note = q<HTMLElement>(root, '[data-timer-note]')
    if (!display || !toggle) return

    let remaining = 0
    let timer = 0

    const render = () => {
      display.textContent = `${pad2(remaining / 60)}:${pad2(remaining % 60)}`
    }
    const stop = () => {
      clearInterval(timer)
      timer = 0
      toggle.textContent = '開始'
    }

    root.querySelectorAll<HTMLElement>('[data-timer-set]').forEach((chip) => {
      chip.addEventListener('click', () => {
        stop()
        remaining = Number(chip.dataset.timerSet ?? 0)
        render()
      })
    })

    toggle.addEventListener('click', () => {
      if (timer) {
        stop()
        return
      }
      if (remaining <= 0) {
        showToast('時間を選んでください。0秒はすでに終わっています。')
        return
      }
      toggle.textContent = '一時停止'
      timer = window.setInterval(() => {
        remaining -= 1
        render()
        if (remaining <= 0) {
          stop()
          if (note) note.textContent = '⏰ 時間です。音は鳴りません（スピーカーがないので）。'
          showToast('⏰ 時間です。音は鳴りません。')
        }
      }, 1000)
    })

    reset?.addEventListener('click', () => {
      stop()
      remaining = 0
      render()
    })
  })
}

/** カレンダー: サーバーが描いた月を、閲覧者の「今日」で描き直す */
function setupCalendars(): void {
  each<HTMLElement>('[data-calendar]', (root) => {
    const grid = q<HTMLElement>(root, '[data-cal-grid]')
    const month = q<HTMLElement>(root, '[data-cal-month]')
    if (!grid) return

    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    if (month) month.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月`

    grid.textContent = ''
    for (const label of WEEKDAYS) {
      const dow = document.createElement('span')
      dow.className = 'ak-cal-dow'
      dow.textContent = label
      grid.appendChild(dow)
    }
    const cells: (number | null)[] = Array.from({ length: first.getDay() }, () => null)
    for (let d = 1; d <= days; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    for (const day of cells) {
      const cell = document.createElement('span')
      cell.className = `ak-cal-day${day === null ? ' is-empty' : ''}${day === now.getDate() ? ' is-today' : ''}`
      cell.textContent = day === null ? '' : String(day)
      grid.appendChild(cell)
    }
  })
}

function setupReminders(): void {
  each<HTMLElement>('[data-reminders]', (root) => {
    const form = q<HTMLFormElement>(root, '[data-reminder-form]')
    const input = q<HTMLInputElement>(root, '[data-reminder-input]')
    const list = q<HTMLElement>(root, '[data-reminder-list]')
    const count = q<HTMLElement>(root, '[data-reminder-count]')
    if (!list) return

    const recount = () => {
      if (!count) return
      const left = list.querySelectorAll('.ak-check-item:not(.is-done)').length
      count.textContent = left === 0 ? 'ぜんぶ終わりました。めずらしい日です。' : `${left} 件のこっています`
    }

    list.addEventListener('click', (e) => {
      const box = (e.target as HTMLElement).closest<HTMLElement>('[data-reminder-toggle]')
      const item = box?.closest<HTMLElement>('.ak-check-item')
      if (!box || !item) return
      const done = item.classList.toggle('is-done')
      box.textContent = done ? '✓' : ''
      box.setAttribute('aria-pressed', String(done))
      recount()
    })

    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const text = input?.value.trim()
      if (!text) return
      const li = document.createElement('li')
      li.className = 'ak-check-item'
      const box = document.createElement('button')
      box.type = 'button'
      box.className = 'ak-check-box'
      box.setAttribute('data-reminder-toggle', '')
      box.setAttribute('aria-pressed', 'false')
      const wrap = document.createElement('span')
      wrap.className = 'ak-check-text'
      const title = document.createElement('span')
      title.className = 'ak-check-title'
      title.textContent = text
      const note = document.createElement('span')
      note.className = 'ak-check-note'
      note.textContent = 'この画面を閉じるまで有効です'
      wrap.append(title, note)
      li.append(box, wrap)
      list.prepend(li)
      if (input) input.value = ''
      recount()
    })

    recount()
  })
}

export function setupTimeApps(): void {
  setupWorldClocks()
  setupStopwatches()
  setupTimers()
  setupCalendars()
  setupReminders()
}
