export default function TerminalBlockedDialog() {
  return (
    <div className="sp-app-view" data-app="terminal-blocked">
      <div className="sp-dialog-overlay">
        <div
          className="sp-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sp-terminal-blocked-title"
          aria-describedby="sp-terminal-blocked-message"
        >
          <div className="sp-dialog-title" id="sp-terminal-blocked-title">
            "ターミナル" は tomokiPhone では動作しません
          </div>
          <p className="sp-dialog-message" id="sp-terminal-blocked-message">
            このAppはマウスとキーボードと本人のやる気を必要とします。
          </p>
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
