// 壁紙。PCの右クリックメニュー・設定アプリ・SPのコントロールセンターから共通で使う。

const WALLPAPERS = ['', 'melon', 'ichigo', 'yozora', 'classic'] as const
const WALLPAPER_STORAGE_KEY = 'tomokios-wallpaper'

const LABELS: Record<(typeof WALLPAPERS)[number], string> = {
  '': 'ソーダ',
  melon: 'メロン',
  ichigo: 'いちご',
  yozora: 'よぞら',
  classic: 'クラシック',
}

function applyWallpaper(name: string): void {
  if (name) {
    document.documentElement.setAttribute('data-wallpaper', name)
  } else {
    document.documentElement.removeAttribute('data-wallpaper')
  }
  try {
    localStorage.setItem(WALLPAPER_STORAGE_KEY, name)
  } catch {}
  // 設定アプリの「現在の壁紙」表示（PC/SPの両方にある）
  document.querySelectorAll<HTMLElement>('[data-settings-wallpaper]').forEach((el) => {
    el.textContent = getWallpaperLabel()
  })
}

export function restoreWallpaper(): void {
  try {
    const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY)
    if (saved && WALLPAPERS.includes(saved as (typeof WALLPAPERS)[number])) applyWallpaper(saved)
  } catch {}
}

export function cycleWallpaper(): void {
  const current = document.documentElement.getAttribute('data-wallpaper') ?? ''
  const index = WALLPAPERS.indexOf(current as (typeof WALLPAPERS)[number])
  applyWallpaper(WALLPAPERS[(index + 1) % WALLPAPERS.length] ?? '')
}

export function getWallpaperLabel(): string {
  const current = (document.documentElement.getAttribute('data-wallpaper') ?? '') as (typeof WALLPAPERS)[number]
  return LABELS[current] ?? 'ソーダ'
}

/** 設定アプリの壁紙ボタン（PC/SP共通） */
export function setupWallpaperControls(): void {
  document.querySelectorAll<HTMLElement>('[data-settings-wallpaper-next]').forEach((button) => {
    button.addEventListener('click', cycleWallpaper)
  })
  document.querySelectorAll<HTMLElement>('[data-settings-wallpaper]').forEach((el) => {
    el.textContent = getWallpaperLabel()
  })
}
