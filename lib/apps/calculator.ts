// 電卓アプリのロジック
// PC（ウィンドウ）とSP（アプリ）に同じDOMが同時に存在するため、
// [data-calc] を全部拾ってインスタンスごとに状態を持たせる。

export type CalcOp = 'add' | 'sub' | 'mul' | 'div'

type CalcState = {
  /** 現在の入力（表示用の文字列） */
  entry: string
  /** 演算子を押した時点までの累積値 */
  acc: number | null
  op: CalcOp | null
  /** 次の数字入力で entry を置き換える（＝直後・演算子直後） */
  fresh: boolean
  /** ＝の連打で繰り返す直前の演算 */
  repeat: { op: CalcOp; operand: number } | null
  /** 「むり」「けたあふれ」等。入るとACするまで表示を占有する */
  error: string | null
  note: string
}

const MAX_DIGITS = 12
const DEFAULT_NOTE = '四則演算まで対応しています（それ以上は本人も暗算できません）'

const OP_SIGN: Record<CalcOp, string> = { add: '＋', sub: '−', mul: '×', div: '÷' }
const OP_FROM_SIGN: Record<string, CalcOp> = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div' }

// キーボード入力 → キーID（数字は正規表現で拾うのでここには持たない）
const KEY_MAP: Record<string, string> = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  x: 'mul',
  '/': 'div',
  '=': 'eq',
  Enter: 'eq',
  Escape: 'ac',
  Backspace: 'del',
  '.': 'dot',
  ',': 'dot',
  '%': 'pct',
}

function initialState(): CalcState {
  return { entry: '0', acc: null, op: null, fresh: true, repeat: null, error: null, note: DEFAULT_NOTE }
}

/** 12桁に丸めて文字列化する。桁からあふれる（大きすぎ・小さすぎる）ときは null */
function format(value: number): string | null {
  if (!Number.isFinite(value)) return null
  const rounded = Number.parseFloat(value.toPrecision(MAX_DIGITS))
  if (Math.abs(rounded) >= 10 ** MAX_DIGITS) return null
  if (rounded !== 0 && Math.abs(rounded) < 1e-9) return null
  const text = String(rounded)
  return text.includes('e') ? null : text
}

function apply(a: number, b: number, op: CalcOp): number | 'div0' {
  switch (op) {
    case 'add':
      return a + b
    case 'sub':
      return a - b
    case 'mul':
      return a * b
    case 'div':
      return b === 0 ? 'div0' : a / b
  }
}

/** 特定の答えにだけ小ネタを返す（それ以外はいつもの一言） */
function noteFor(result: number): string {
  if (result === 640) return '640。じゅうぶんです。'
  if (result === 1024) return '1024。ちょうど1KBぶんあります。'
  if (result === 2006) return '2006。あのころからずっと稼働しています。'
  if (result === 404) return '404。こたえは見つかりませんでした（でも表示します）。'
  return DEFAULT_NOTE
}

function divZero(state: CalcState): CalcState {
  return {
    ...state,
    entry: '0',
    acc: null,
    op: null,
    fresh: true,
    repeat: null,
    error: 'むり',
    note: '0では割れません。世の中には割り切れないこともあります。',
  }
}

function overflow(state: CalcState): CalcState {
  return {
    ...state,
    entry: '0',
    acc: null,
    op: null,
    fresh: true,
    repeat: null,
    error: 'けたあふれ',
    note: 'けたがあふれました。640KBでは表現しきれません。',
  }
}

function inputDigit(state: CalcState, digit: string): CalcState {
  if (state.error) return { ...initialState(), entry: digit, fresh: false }
  if (state.fresh) return { ...state, entry: digit, fresh: false, note: DEFAULT_NOTE }

  const digits = state.entry.replace(/[-.]/g, '').length
  if (digits >= MAX_DIGITS) return { ...state, note: 'これ以上は入りません（電卓ですから）' }

  return { ...state, entry: state.entry === '0' ? digit : state.entry + digit, note: DEFAULT_NOTE }
}

function inputDot(state: CalcState): CalcState {
  if (state.error) return { ...initialState(), entry: '0.', fresh: false }
  if (state.fresh) return { ...state, entry: '0.', fresh: false, note: DEFAULT_NOTE }
  if (state.entry.includes('.')) return { ...state, note: '小数点はひとつで足ります。' }
  return { ...state, entry: `${state.entry}.`, note: DEFAULT_NOTE }
}

function backspace(state: CalcState): CalcState {
  if (state.error) return initialState()
  if (state.fresh) return state
  const next = state.entry.slice(0, -1)
  if (next === '' || next === '-') return { ...state, entry: '0', fresh: true }
  return { ...state, entry: next }
}

function negate(state: CalcState): CalcState {
  if (state.error) return state
  if (state.entry === '0') return { ...state, note: 'マイナス0は、けっきょく0です。' }
  const entry = state.entry.startsWith('-') ? state.entry.slice(1) : `-${state.entry}`
  return { ...state, entry, note: DEFAULT_NOTE }
}

function percent(state: CalcState): CalcState {
  if (state.error) return state
  const text = format(Number.parseFloat(state.entry) / 100)
  if (text === null) return overflow(state)
  return { ...state, entry: text, fresh: true, note: DEFAULT_NOTE }
}

function chooseOp(state: CalcState, op: CalcOp): CalcState {
  if (state.error) return { ...state, note: 'まずACを押してください。' }

  const current = Number.parseFloat(state.entry)

  // 演算子の連続（1 + 2 × …）はその場でたたんでから次の演算子を持つ
  if (state.acc !== null && state.op !== null && !state.fresh) {
    const result = apply(state.acc, current, state.op)
    if (result === 'div0') return divZero(state)
    const text = format(result)
    if (text === null) return overflow(state)
    return { ...state, entry: text, acc: result, op, fresh: true, repeat: null, note: noteFor(result) }
  }

  return { ...state, acc: current, op, fresh: true, repeat: null, note: DEFAULT_NOTE }
}

function equals(state: CalcState): CalcState {
  if (state.error) return { ...state, note: 'まずACを押してください。' }

  const current = Number.parseFloat(state.entry)
  let result: number | 'div0'
  let repeat: { op: CalcOp; operand: number }

  if (state.acc !== null && state.op !== null) {
    repeat = { op: state.op, operand: current }
    result = apply(state.acc, current, state.op)
  } else if (state.repeat) {
    // ＝の連打は直前の演算をくり返す（本物の電卓と同じ）
    repeat = state.repeat
    result = apply(current, state.repeat.operand, state.repeat.op)
  } else {
    return { ...state, fresh: true, note: '＝だけ押されても、こまります。' }
  }

  if (result === 'div0') return divZero(state)
  const text = format(result)
  if (text === null) return overflow(state)

  return { ...state, entry: text, acc: null, op: null, fresh: true, repeat, note: noteFor(result) }
}

export function press(state: CalcState, key: string): CalcState {
  if (/^[0-9]$/.test(key)) return inputDigit(state, key)
  switch (key) {
    case 'dot':
      return inputDot(state)
    case 'del':
      return backspace(state)
    case 'ac':
      return { ...initialState(), note: state.error ? '気を取りなおしていきましょう。' : DEFAULT_NOTE }
    case 'neg':
      return negate(state)
    case 'pct':
      return percent(state)
    case 'add':
    case 'sub':
    case 'mul':
    case 'div':
      return chooseOp(state, key)
    case 'eq':
      return equals(state)
    default:
      return state
  }
}

/** 3桁区切りにする（小数部と符号はそのまま） */
function group(text: string): string {
  const sign = text.startsWith('-') ? '-' : ''
  const body = sign ? text.slice(1) : text
  const [int = '0', frac] = body.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${sign}${grouped}${frac === undefined ? '' : `.${frac}`}`
}

function mainText(state: CalcState): string {
  return state.error ?? group(state.entry)
}

/** 表示上段: 計算の途中式（「640 ÷」「× 2 ＝」など） */
function subText(state: CalcState): string {
  if (state.error) return 'ERROR'
  if (state.acc !== null && state.op !== null) return `${group(format(state.acc) ?? '0')} ${OP_SIGN[state.op]}`
  if (state.repeat) return `${OP_SIGN[state.repeat.op]} ${group(format(state.repeat.operand) ?? '0')} ＝`
  return '640KB 空きあり'
}

function flashKey(root: HTMLElement, key: string): void {
  const button = root.querySelector<HTMLElement>(`[data-calc-key="${key}"]`)
  if (!button) return
  button.classList.add('is-keyed')
  setTimeout(() => button.classList.remove('is-keyed'), 140)
}

function setupCalculator(root: HTMLElement): void {
  const main = root.querySelector<HTMLElement>('[data-calc-main]')
  const sub = root.querySelector<HTMLElement>('[data-calc-sub]')
  const note = root.querySelector<HTMLElement>('[data-calc-note]')
  if (!main || !sub) return

  let state = initialState()

  const render = () => {
    main.textContent = mainText(state)
    sub.textContent = subText(state)
    if (note) note.textContent = state.note
  }

  root.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>('[data-calc-key]')
    const key = button?.getAttribute('data-calc-key')
    if (!key) return
    state = press(state, key)
    render()
  })

  // 表示部分など、キー以外を触ったときもキーボード入力を受け取れるようにする
  root.addEventListener('pointerdown', (e) => {
    if (!(e.target as HTMLElement).closest('button')) root.focus()
  })

  // 物理キーボード（電卓にフォーカスがあるあいだだけ）
  root.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const key = /^[0-9]$/.test(e.key) ? e.key : KEY_MAP[e.key]
    if (!key) return
    // Enter/Spaceでのボタン既定動作（clickの二重発火）を止めてから流す
    e.preventDefault()
    state = press(state, key)
    render()
    flashKey(root, key)
  })

  render()
}

export function setupCalculators(): void {
  document.querySelectorAll<HTMLElement>('[data-calc]').forEach(setupCalculator)
}

/** ターミナルの `calc <しき>`。優先順位は考慮せず左から順にたたむ */
export function evaluateExpression(input: string): string[] {
  const normalized = input
    .replace(/[＋]/g, '+')
    .replace(/[－ー−]/g, '-')
    .replace(/[×✕＊*]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/[０-９．]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, '')

  const tokens = normalized.match(/\d+(?:\.\d+)?|[+\-*/]/g)
  if (!tokens || tokens.length === 0 || tokens.length % 2 === 0) {
    return ['calc: しきが読めません（例: calc 640+0）']
  }

  let acc = Number(tokens[0])
  if (Number.isNaN(acc)) return ['calc: しきが読めません（例: calc 640+0）']

  let mixed = false
  for (let i = 1; i < tokens.length; i += 2) {
    const op = OP_FROM_SIGN[tokens[i] ?? '']
    const rhs = Number(tokens[i + 1])
    if (!op || Number.isNaN(rhs)) return ['calc: しきが読めません（例: calc 640+0）']
    if (op === 'mul' || op === 'div') mixed = true
    const result = apply(acc, rhs, op)
    if (result === 'div0') return ['0では割れません。世の中には割り切れないこともあります。']
    acc = result
  }

  const text = format(acc)
  if (text === null) return ['けたあふれ（640KBでは表現しきれません）']

  const lines = [group(text)]
  if (mixed && tokens.length > 3) lines.push('（左から順に計算しました。優先順位はv27で対応予定）')
  const note = noteFor(acc)
  if (note !== DEFAULT_NOTE) lines.push(note)
  return lines
}
