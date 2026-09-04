// アプリの本体はOSの中に1つだけ存在する。
//
// サーバーはPCのウィンドウの中に本体を描き、SPのアプリ画面は空の器として置く。
// 起動時（と768pxの境界をまたいだとき）に、本体を「いま見えているほうの器」へ引っ越す。
//
// こうする理由:
//   1. 70個のアプリを2回描くとHTMLが倍になる（実測でgzip後 約2倍）
//   2. 状態が二重に存在しない（片方の電卓だけ答えが違う、が起きない）
//   3. 引っ越しは appendChild なので、付けたイベントリスナも Canvas の絵もそのまま残る
//
// SEOとJS無効時の表示はPC側のDOMが担う（本体はそこに描かれている）。

const MQ = '(min-width: 768px)'

type Slot = { pc: HTMLElement; sp: HTMLElement }

let slots: Slot[] = []

function collectSlots(): Slot[] {
  const pairs: Slot[] = []
  for (const sp of document.querySelectorAll<HTMLElement>('.sp-app-body[data-app-slot]')) {
    const id = sp.dataset.appSlot
    if (!id) continue
    const pc = document.querySelector<HTMLElement>(`.os-window[data-window="${id}"] > .os-window-body`)
    if (pc) pairs.push({ pc, sp })
  }
  return pairs
}

function moveTo(target: 'pc' | 'sp'): void {
  for (const slot of slots) {
    const from = target === 'pc' ? slot.sp : slot.pc
    const to = target === 'pc' ? slot.pc : slot.sp
    if (from.firstChild) to.append(...Array.from(from.childNodes))
  }
}

/** 起動時に一度だけ呼ぶ。以後は画面幅の変化に自分で追従する */
export function setupAdoption(): void {
  slots = collectSlots()
  if (!slots.length) return

  const mq = window.matchMedia(MQ)
  const sync = () => moveTo(mq.matches ? 'pc' : 'sp')
  sync()
  mq.addEventListener('change', sync)
}
