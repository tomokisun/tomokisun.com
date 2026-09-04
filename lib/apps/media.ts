// ミュージック / 写真 / カメラ / ボイスメモ / これなに？ の中身。
// 音も映像も出ないOSなので、演出はぜんぶ時間と数字でつくる。

import { showToast } from '../ui'
import { each, pad2, q } from './common'

const TRACKS = [
  { title: 'ビルドが通った', artist: 'tomokisun', seconds: 192 },
  { title: '640KBのワルツ', artist: 'Cream Soda Quartet', seconds: 126 },
  { title: 'インフラ層（未完）', artist: 'tomokisun', seconds: 19 },
  { title: '深夜のホットリロード', artist: 'Turbopack', seconds: 244 },
  { title: 'そっちは天井です', artist: 'tomokiOS', seconds: 60 },
]

const time = (s: number) => `${Math.floor(s / 60)}:${pad2(s % 60)}`

function setupMusic(): void {
  each<HTMLElement>('[data-music]', (root) => {
    const title = q<HTMLElement>(root, '[data-music-title]')
    const artist = q<HTMLElement>(root, '[data-music-artist]')
    const progress = q<HTMLElement>(root, '[data-music-progress]')
    const elapsedEl = q<HTMLElement>(root, '[data-music-elapsed]')
    const lengthEl = q<HTMLElement>(root, '[data-music-length]')
    const toggle = q<HTMLButtonElement>(root, '[data-music-toggle]')
    // 曲リストはプレイヤーの外（同じアプリ本体の中）にあるので、共通の親から引く
    const scope = root.parentElement ?? root
    const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-music-track]'))

    let index = 0
    let position = 0
    let playing = false
    let timer = 0

    const render = () => {
      const track = TRACKS[index]
      if (!track) return
      if (title) title.textContent = track.title
      if (artist) artist.textContent = track.artist
      if (lengthEl) lengthEl.textContent = time(track.seconds)
      if (elapsedEl) elapsedEl.textContent = time(position)
      if (progress) progress.style.width = `${(position / track.seconds) * 100}%`
      for (const row of rows) row.classList.toggle('is-playing', Number(row.dataset.musicTrack) === index)
    }

    const stop = () => {
      playing = false
      clearInterval(timer)
      timer = 0
      if (toggle) toggle.textContent = '▶ 再生'
    }

    const play = () => {
      playing = true
      if (toggle) toggle.textContent = '⏸ 一時停止'
      clearInterval(timer)
      timer = window.setInterval(() => {
        const track = TRACKS[index]
        if (!track) return
        position += 1
        if (position >= track.seconds) {
          position = 0
          index = (index + 1) % TRACKS.length
        }
        render()
      }, 1000)
    }

    const select = (next: number, autoplay: boolean) => {
      index = (next + TRACKS.length) % TRACKS.length
      position = 0
      render()
      if (autoplay) play()
    }

    toggle?.addEventListener('click', () => {
      if (playing) {
        stop()
        showToast('一時停止しました。もともと無音です。')
      } else {
        play()
      }
      render()
    })
    q<HTMLButtonElement>(root, '[data-music-prev]')?.addEventListener('click', () => select(index - 1, playing))
    q<HTMLButtonElement>(root, '[data-music-next]')?.addEventListener('click', () => select(index + 1, playing))
    for (const row of rows) {
      row.addEventListener('click', () => select(Number(row.dataset.musicTrack ?? 0), true))
    }

    render()
  })
}

function setupPhotos(): void {
  each<HTMLElement>('[data-photos]', (root) => {
    const view = q<HTMLElement>(root, '[data-photo-view]')
    const big = q<HTMLElement>(root, '[data-photo-big]')
    const caption = q<HTMLElement>(root, '[data-photo-caption-out]')
    if (!view) return

    root.addEventListener('click', (e) => {
      const photo = (e.target as HTMLElement).closest<HTMLElement>('[data-photo]')
      if (!photo) return
      if (big) big.textContent = photo.dataset.photo ?? ''
      if (caption) caption.textContent = photo.dataset.photoCaption ?? ''
      view.hidden = false
      q<HTMLButtonElement>(view, '[data-photo-close]')?.focus()
    })

    q<HTMLButtonElement>(root, '[data-photo-close]')?.addEventListener('click', () => {
      view.hidden = true
    })
  })
}

const SUBJECTS = ['🍈', '☕️', '🖥', '🌙', '🐙', '🧢', '🥤', '📱', '🗜']

/** カメラで撮ったものは、その画面の写真アプリに増える（同じ画面のDOMだけを触る） */
function setupCamera(): void {
  each<HTMLElement>('[data-camera]', (root) => {
    const subject = q<HTMLElement>(root, '[data-camera-subject]')
    const viewfinder = q<HTMLElement>(root, '[data-camera-view]')
    const note = q<HTMLElement>(root, '[data-camera-note]')
    let index = 0

    const flip = () => {
      index = (index + 1) % SUBJECTS.length
      if (subject) subject.textContent = SUBJECTS[index] ?? '🍈'
    }

    q<HTMLButtonElement>(root, '[data-camera-flip]')?.addEventListener('click', () => {
      flip()
      if (note) note.textContent = 'レンズを切り替えました。写るものが変わっただけです。'
    })

    q<HTMLButtonElement>(root, '[data-camera-shoot]')?.addEventListener('click', () => {
      const emoji = SUBJECTS[index] ?? '🍈'
      viewfinder?.classList.add('is-shooting')
      setTimeout(() => viewfinder?.classList.remove('is-shooting'), 220)

      const grid = document.querySelector<HTMLElement>('[data-photos] .ak-grid')
      if (grid) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'ak-photo is-new'
        button.setAttribute('data-photo', emoji)
        button.setAttribute('data-photo-caption', `いま撮った ${emoji}`)
        button.setAttribute('aria-label', `いま撮った ${emoji}`)
        const span = document.createElement('span')
        span.setAttribute('aria-hidden', 'true')
        span.textContent = emoji
        button.appendChild(span)
        grid.prepend(button)
      }
      if (note) note.textContent = `${emoji} を撮りました。写真アプリに増えています。`
      showToast(`${emoji} を撮りました。写真アプリをどうぞ。`)
      flip()
    })
  })
}

function setupRecorder(): void {
  each<HTMLElement>('[data-recorder]', (root) => {
    const wave = q<HTMLElement>(root, '[data-recorder-wave]')
    const display = q<HTMLElement>(root, '[data-recorder-time]')
    const button = q<HTMLButtonElement>(root, '[data-recorder-toggle]')
    if (!button) return

    let seconds = 0
    let timer = 0
    const bars = wave ? (Array.from(wave.children) as HTMLElement[]) : []

    const jiggle = () => {
      for (const bar of bars) bar.style.height = `${12 + Math.random() * 34}px`
    }

    button.addEventListener('click', () => {
      if (timer) {
        clearInterval(timer)
        timer = 0
        root.classList.remove('is-recording')
        for (const bar of bars) bar.style.height = ''
        showToast(`${pad2(seconds / 60)}:${pad2(seconds % 60)} 録れました。再生はできません。`)
        seconds = 0
        if (display) display.textContent = '00:00'
        return
      }
      root.classList.add('is-recording')
      timer = window.setInterval(() => {
        seconds += 1
        if (display) display.textContent = `${pad2(seconds / 60)}:${pad2(seconds % 60)}`
        jiggle()
      }, 200)
    })
  })
}

const SHAZAM_RESULTS = [
  '「作業用BGM」 — 判定: たぶん',
  '「冷蔵庫（変ロ長調）」 — 生活音 ｜ 判定: 自信あり',
  '「ビルドが通った」 — tomokisun ｜ 判定: 願望',
  '無音でした。このOSにスピーカーはありません。',
]

function setupShazam(): void {
  each<HTMLElement>('[data-shazam]', (root) => {
    const button = q<HTMLButtonElement>(root, '[data-shazam-listen]')
    const label = q<HTMLElement>(root, '[data-shazam-label]')
    const result = q<HTMLElement>(root, '[data-shazam-result]')
    if (!button) return
    let turn = 0

    button.addEventListener('click', () => {
      if (root.classList.contains('is-listening')) return
      root.classList.add('is-listening')
      if (label) label.textContent = 'きいています'
      if (result) result.textContent = '…'
      setTimeout(() => {
        root.classList.remove('is-listening')
        if (label) label.textContent = 'きく'
        if (result) result.textContent = SHAZAM_RESULTS[turn % SHAZAM_RESULTS.length] ?? ''
        turn += 1
      }, 1800)
    })
  })
}

export function setupMediaApps(): void {
  setupMusic()
  setupPhotos()
  setupCamera()
  setupRecorder()
  setupShazam()
}
