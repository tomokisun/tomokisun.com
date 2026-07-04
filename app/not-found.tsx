export default function NotFound() {
  return (
    <div className="os-root">
      <main id="main-content" className="os-desktop os-desktop--error">
        <section className="os-window os-window--dialog is-open" aria-label="ファイルが見つかりません">
          <header className="os-titlebar tb-cherry">
            <h1 className="os-title">システムエラー</h1>
          </header>
          <div className="os-window-body">
            <div className="error-body">
              <div className="error-icon" aria-hidden="true">
                💣
              </div>
              <div className="error-code">ERROR 404</div>
              <p className="error-title">FILE NOT FOUND</p>
              <p className="error-message">
                お探しのページは移動したか、削除されたか、最初から存在していません。infra.zip
                と一緒にゴミ箱にある可能性があります。
              </p>
              <p className="error-hint">再起動でだいたい直ります（このOSも例外ではありません）。</p>
              <a className="os-button" href="/">
                デスクトップに戻る
              </a>
            </div>
          </div>
          <footer className="os-statusbar">tomokiOS 26 ｜ ファイルシステムは無事です（たぶん）</footer>
        </section>
      </main>
    </div>
  )
}
