// 電卓の中身。PCウィンドウ（CalculatorWindow）とSPアプリ（CalculatorApp）で共有する。
// 動きは lib/apps/calculator.ts が [data-calc] を拾って付ける。

type CalcKey = {
  label: string
  value: string
  variant?: 'fn' | 'op' | 'eq' | 'zero'
  aria?: string
}

const KEYS: CalcKey[] = [
  { label: 'AC', value: 'ac', variant: 'fn', aria: 'ぜんぶ消す' },
  { label: '±', value: 'neg', variant: 'fn', aria: '符号を反転' },
  { label: '%', value: 'pct', variant: 'fn', aria: 'パーセント' },
  { label: '÷', value: 'div', variant: 'op', aria: 'わる' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '×', value: 'mul', variant: 'op', aria: 'かける' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '−', value: 'sub', variant: 'op', aria: 'ひく' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '＋', value: 'add', variant: 'op', aria: 'たす' },
  { label: '0', value: '0', variant: 'zero' },
  { label: '.', value: 'dot', aria: '小数点' },
  { label: '＝', value: 'eq', variant: 'eq', aria: 'こたえ' },
]

export default function CalculatorBody() {
  // tabIndex=-1: 表示部分をクリックしたときもルートへフォーカスを移してキーボード入力を効かせる
  return (
    <div className="calc" data-calc tabIndex={-1}>
      <div className="calc-display" aria-live="polite" aria-atomic="true">
        <span className="calc-display-sub" data-calc-sub>
          640KB 空きあり
        </span>
        <span className="calc-display-main" data-calc-main>
          0
        </span>
      </div>
      <div className="calc-keys">
        {KEYS.map((key) => (
          <button
            key={key.value}
            type="button"
            className={`calc-key${key.variant ? ` calc-key--${key.variant}` : ''}`}
            data-calc-key={key.value}
            aria-label={key.aria}
          >
            {key.label}
          </button>
        ))}
      </div>
      <p className="calc-note" data-calc-note aria-live="polite">
        四則演算まで対応しています（それ以上は本人も暗算できません）
      </p>
    </div>
  )
}
