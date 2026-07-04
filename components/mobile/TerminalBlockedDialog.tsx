export default function TerminalBlockedDialog() {
  return (
    <div className="sp-app-view" data-app="terminal-blocked">
      <div className="sp-dialog-overlay">
        <div className="sp-dialog">
          <div className="sp-dialog-title">"ターミナル" は tomokiPhone では動作しません</div>
          <p className="sp-dialog-message">このAppはマウスとキーボードと本人のやる気を必要とします。</p>
          <div className="sp-dialog-actions">
            <button type="button" className="os-button" data-sp-close>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
