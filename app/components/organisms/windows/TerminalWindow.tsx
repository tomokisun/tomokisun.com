import Window from '../Window'

type TerminalWindowProps = {
  open?: boolean
}

export default function TerminalWindow({ open = false }: TerminalWindowProps) {
  return (
    <Window id="terminal" title="ターミナル — bash？" color="mint" open={open} statusBar="tty1 ｜ 80×24">
      <div className="term" id="terminal" data-terminal>
        <div className="term-output" data-term-output>
          <div>tomokiOS ターミナル v1.0</div>
          <div>「help」でコマンド一覧を表示します。</div>
          <div>&nbsp;</div>
          <div>
            <span className="term-prompt">$</span> whoami
          </div>
          <div>tomokisun</div>
        </div>
        <div className="term-line">
          <span className="term-prompt">$</span>
          <span className="term-input" data-term-input></span>
          <span className="term-cursor" aria-hidden="true"></span>
        </div>
      </div>
    </Window>
  )
}
