// ターミナルの中身（PC専用）。動きは lib/os.ts の setupTerminal が [data-terminal] に付ける。

export default function TerminalBody() {
  return (
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
  )
}
