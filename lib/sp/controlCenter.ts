// SP: コントロールセンター — ステータスバーから引き下ろす1枚シート。
// 壁紙・明るさ・画面ロック・再起動は本当に動く。機内モードと音量は気持ちの問題。

import { cycleWallpaper, getWallpaperLabel } from '../os'
import { clamp, createGesture, springTo } from './gesture'
import { relock } from './lock'
import { emit, getMode, getPrevMode, setMode } from './state'
import { showToast } from './ui'

let cc: HTMLElement | null = null
let scrim: HTMLElement | null = null
let battery: HTMLElement | null = null
let cancelSpring: (() => void) | null = null
let airplaneTimer = 0
let carrierTapCount = 0
let volumeNoteTimer = 0

const sheetHeight = () => cc?.offsetHeight ?? 1

function applyDrag(dy: number): void {
  if (!cc || !scrim) return
  const h = sheetHeight()
  const y = clamp(dy, 0, h)
  cc.style.transform = `translateY(calc(-100% + ${y}px))`
  scrim.hidden = false
  scrim.style.opacity = String(0.5 * (y / h))
}

function clearInline(): void {
  if (!cc || !scrim) return
  cc.style.transform = ''
  cc.style.willChange = ''
  scrim.style.opacity = ''
}

function finishOpen(): void {
  if (!cc || !scrim) return
  cc.classList.add('is-open')
  scrim.hidden = false
  clearInline()
  battery?.setAttribute('aria-expanded', 'true')
  setMode('cc')
  emit('cc-opened')
  cc.querySelector<HTMLElement>('.sp-cc-tile')?.focus()
}

function finishClose(silently = false): void {
  if (!cc || !scrim) return
  cc.classList.remove('is-open')
  scrim.hidden = true
  clearInline()
  battery?.setAttribute('aria-expanded', 'false')
  if (getMode() === 'cc') {
    const prev = getPrevMode()
    setMode(prev === 'locked' ? 'home' : prev)
  }
  if (!silently) battery?.focus()
}

function openCC(v0 = 0.8): void {
  const mode = getMode()
  if (mode === 'cc' || (mode !== 'home' && mode !== 'app' && mode !== 'edit')) return
  if (!cc || !scrim) return
  cancelSpring?.()
  cc.style.willChange = 'transform'
  const h = sheetHeight()
  cancelSpring = springTo({
    from: 0,
    to: h,
    v0,
    onFrame: (y) => applyDrag(y),
    onDone: () => {
      cancelSpring = null
      finishOpen()
    },
  })
}

function closeCC(v0 = -0.8, silently = false): void {
  if (!cc || !scrim || getMode() !== 'cc') return
  cancelSpring?.()
  cc.classList.remove('is-open')
  cc.style.willChange = 'transform'
  const h = sheetHeight()
  cancelSpring = springTo({
    from: h,
    to: 0,
    v0,
    onFrame: (y) => applyDrag(y),
    onDone: () => {
      cancelSpring = null
      finishClose(silently)
    },
  })
}

function retract(fromY: number, v0: number): void {
  cancelSpring?.()
  cancelSpring = springTo({
    from: fromY,
    to: 0,
    v0,
    onFrame: (y) => applyDrag(y),
    onDone: () => {
      cancelSpring = null
      if (!scrim) return
      scrim.hidden = true
      clearInline()
    },
  })
}

function updateWallpaperLabel(): void {
  const label = cc?.querySelector<HTMLElement>('[data-cc-wallpaper-label]')
  if (label) label.textContent = getWallpaperLabel()
}

function setAirplane(onNow: boolean): void {
  const tile = cc?.querySelector<HTMLElement>('[data-cc="airplane"]')
  const carrier = document.querySelector<HTMLElement>('.sp-statusbar-carrier')
  if (!tile) return
  clearTimeout(airplaneTimer)
  tile.setAttribute('aria-checked', String(onNow))
  tile.classList.toggle('is-on', onNow)
  document.documentElement.toggleAttribute('data-sp-airplane', onNow)
  if (carrier) carrier.textContent = onNow ? '圏外（自称）' : 'ONE 5G'
  if (onNow) {
    airplaneTimer = window.setTimeout(() => {
      setAirplane(false)
      showToast('勝手に着陸しました')
    }, 3000)
  }
}

function setBrightness(value: number): void {
  const filter = document.querySelector<HTMLElement>('.sp-screen-filter')
  const note = cc?.querySelector<HTMLElement>('[data-cc-brightness-note]')
  if (!filter) return
  const level = clamp(value, 50, 100) / 100
  if (level >= 1) {
    filter.classList.remove('is-active')
    filter.style.removeProperty('--sp-brightness')
  } else {
    filter.classList.add('is-active')
    filter.style.setProperty('--sp-brightness', String(level))
  }
  if (note) note.hidden = value > 50
}

function trapFocus(e: KeyboardEvent): void {
  if (!cc || getMode() !== 'cc' || e.key !== 'Tab') return
  const focusables = Array.from(cc.querySelectorAll<HTMLElement>('button, input'))
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (!first || !last) return
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

export function setupControlCenter(): void {
  cc = document.querySelector<HTMLElement>('.sp-cc')
  scrim = document.querySelector<HTMLElement>('.sp-cc-scrim')
  battery = document.querySelector<HTMLElement>('[data-cc-open]')
  const statusbar = document.querySelector<HTMLElement>('.sp-statusbar')
  if (!cc || !scrim || !statusbar) return

  updateWallpaperLabel()

  // ステータスバーから引き下ろす
  createGesture(statusbar, {
    axis: 'y',
    onStart: () => {
      const mode = getMode()
      if (mode !== 'home' && mode !== 'app' && mode !== 'edit') return false
      cancelSpring?.()
      cancelSpring = null
      if (cc) cc.style.willChange = 'transform'
      return undefined
    },
    onMove: (s) => applyDrag(s.dy),
    onEnd: (s, isTap) => {
      if (isTap) {
        // ステータスバー自体のタップはCCを開かない（電池・キャリアのclickに任せる）
        retract(clamp(s.dy, 0, sheetHeight()), 0)
        return
      }
      if (s.dy > 64 || s.vy > 0.4) {
        cancelSpring?.()
        cancelSpring = springTo({
          from: clamp(s.dy, 0, sheetHeight()),
          to: sheetHeight(),
          v0: Math.max(s.vy, 0.2),
          onFrame: (y) => applyDrag(y),
          onDone: () => {
            cancelSpring = null
            finishOpen()
          },
        })
      } else {
        retract(clamp(s.dy, 0, sheetHeight()), s.vy)
      }
    },
    onCancel: () => retract(0, 0),
  })

  // グラバーで引き上げて閉じる
  const grabber = cc.querySelector<HTMLElement>('.sp-cc-grabber')
  if (grabber) {
    createGesture(grabber, {
      axis: 'y',
      onStart: () => {
        if (getMode() !== 'cc') return false
        cancelSpring?.()
        cancelSpring = null
        cc?.classList.remove('is-open')
        applyDrag(sheetHeight())
        return undefined
      },
      onMove: (s) => applyDrag(sheetHeight() + Math.min(s.dy, 0)),
      onEnd: (s, isTap) => {
        if (isTap) {
          cc?.classList.add('is-open')
          clearInline()
          closeCC()
          return
        }
        if (-s.dy > 64 || s.vy < -0.4) {
          setModeBackAndClose(sheetHeight() + Math.min(s.dy, 0), Math.min(s.vy, -0.2))
        } else {
          cancelSpring = springTo({
            from: sheetHeight() + Math.min(s.dy, 0),
            to: sheetHeight(),
            v0: s.vy,
            onFrame: (y) => applyDrag(y),
            onDone: () => {
              cancelSpring = null
              finishOpen()
            },
          })
        }
      },
      onCancel: () => finishOpen(),
    })
  }

  function setModeBackAndClose(fromY: number, v0: number): void {
    cancelSpring?.()
    cancelSpring = springTo({
      from: fromY,
      to: 0,
      v0,
      onFrame: (y) => applyDrag(y),
      onDone: () => {
        cancelSpring = null
        finishClose()
      },
    })
  }

  battery?.addEventListener('click', () => {
    if (getMode() === 'cc') closeCC()
    else openCC()
  })

  scrim.addEventListener('click', () => closeCC())

  document.addEventListener('keydown', (e) => {
    if (getMode() !== 'cc') return
    if (e.key === 'Escape') closeCC()
    trapFocus(e)
  })

  // タイル
  cc.querySelector<HTMLElement>('[data-cc="wallpaper"]')?.addEventListener('click', () => {
    cycleWallpaper()
    updateWallpaperLabel()
  })

  cc.querySelector<HTMLElement>('[data-cc="airplane"]')?.addEventListener('click', (e) => {
    const tile = e.currentTarget as HTMLElement
    setAirplane(tile.getAttribute('aria-checked') !== 'true')
  })

  cc.querySelector<HTMLElement>('[data-cc="lock"]')?.addEventListener('click', () => {
    if (!cc || !scrim) return
    cancelSpring?.()
    cancelSpring = null
    cc.classList.remove('is-open')
    scrim.hidden = true
    clearInline()
    battery?.setAttribute('aria-expanded', 'false')
    relock() // cc → locked
  })

  cc.querySelector<HTMLElement>('[data-cc="reboot"]')?.addEventListener('click', () => {
    try {
      sessionStorage.removeItem('tomokios-booted')
    } catch {}
    window.location.reload()
  })

  cc.querySelector<HTMLElement>('[data-cc="switcher"]')?.addEventListener('click', () => {
    if (!cc || !scrim) return
    cancelSpring?.()
    cancelSpring = null
    cc.classList.remove('is-open')
    scrim.hidden = true
    clearInline()
    battery?.setAttribute('aria-expanded', 'false')
    emit('open-switcher', { from: 'cc' })
  })

  const brightness = cc.querySelector<HTMLInputElement>('[data-cc-brightness]')
  brightness?.addEventListener('input', () => setBrightness(Number(brightness.value)))

  const volume = cc.querySelector<HTMLInputElement>('[data-cc-volume]')
  const volumeNote = cc.querySelector<HTMLElement>('[data-cc-volume-note]')
  volume?.addEventListener('input', () => {
    volume.value = '0'
    if (volumeNote) {
      volumeNote.hidden = false
      clearTimeout(volumeNoteTimer)
      volumeNoteTimer = window.setTimeout(() => {
        volumeNote.hidden = true
      }, 2000)
    }
  })

  // キャリア小ネタ（3段設計: 2回まで喋って以降沈黙）
  document.querySelector<HTMLElement>('[data-carrier]')?.addEventListener('click', () => {
    carrierTapCount += 1
    if (carrierTapCount === 1) showToast('アンテナ: 気持ちで5本')
    else if (carrierTapCount === 2) showToast('本日は晴天なり')
  })
}
