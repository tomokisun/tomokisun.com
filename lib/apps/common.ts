// アプリ共通の小さな配線。
// PC・SPの両方のDOMが同時に存在するので、必ず querySelectorAll で全インスタンスに配線し、
// 状態はインスタンスごとに持つ（このファイルの関数はどれもその作法に従う）。

import { showToast } from '../ui'

/** 押すと一言だけ返すボタン（components/apps/kit.tsx の <Quip />） */
export function setupQuips(): void {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-quip]')
    if (!el) return
    const message = el.getAttribute('data-quip')
    if (message) showToast(message)
  })
}

/** タブ（<Segmented /> と <SegPane />）。同じ name のペアだけを切り替える */
export function setupSegmented(): void {
  document.querySelectorAll<HTMLElement>('[data-seg]').forEach((seg) => {
    const name = seg.dataset.seg ?? ''
    const scope = seg.parentElement
    if (!scope) return
    const tabs = Array.from(seg.querySelectorAll<HTMLElement>('[data-seg-tab]'))
    const panes = Array.from(scope.querySelectorAll<HTMLElement>('[data-seg-pane]')).filter((pane) =>
      pane.dataset.segPane?.startsWith(`${name}:`),
    )

    const select = (value: string) => {
      for (const tab of tabs) tab.setAttribute('aria-selected', String(tab.dataset.segTab === value))
      for (const pane of panes) pane.hidden = pane.dataset.segPane !== `${name}:${value}`
    }

    for (const tab of tabs) {
      tab.addEventListener('click', () => select(tab.dataset.segTab ?? ''))
    }
    select(tabs[0]?.dataset.segTab ?? '')
  })
}

/** インスタンスごとの配線をまとめて書くためのヘルパー */
export function each<T extends HTMLElement>(selector: string, fn: (el: T) => void): void {
  document.querySelectorAll<T>(selector).forEach(fn)
}

/** 要素内の [data-*] をまとめて引くための小道具 */
export function q<T extends HTMLElement>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector)
}

export const pad2 = (n: number): string => String(Math.floor(n)).padStart(2, '0')
