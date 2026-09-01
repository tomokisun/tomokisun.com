import CalculatorBody from '../../apps/CalculatorBody'
import Window from '../Window'

export default function CalculatorWindow() {
  return (
    <Window id="calc" title="電卓" color="soda" statusBar="標準 ｜ 12桁 ｜ 関数電卓はv27で">
      <CalculatorBody />
    </Window>
  )
}
