import Window from '../Window'

export default function TerminalWindow() {
  return (
    <Window id="terminal" title="tomokisun@tomokibook: ~" color="dark" statusBar="zsh ｜ 80×24 ｜ 実権限なし">
      <div className="term" data-terminal>
        <div className="term-output" data-term-output>
          <div>tomokiOS 26 ターミナル v1.0</div>
          <div>「help」でコマンド一覧を表示します。</div>
          <div>&nbsp;</div>
          <div>
            <span className="term-prompt">tomokisun@tomokibook ~ %</span> whoami
          </div>
          <div>tomokisun</div>
        </div>
        <div className="term-line">
          <span className="term-prompt">tomokisun@tomokibook ~ %</span>
          <span className="term-input" data-term-input />
          <span className="term-cursor" aria-hidden="true" />
        </div>
      </div>
    </Window>
  )
}
