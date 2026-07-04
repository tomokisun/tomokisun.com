'use client'

export default function ErrorPage() {
  return (
    <div className="os-root">
      <main id="main-content" className="os-desktop os-desktop--error">
        <section className="os-window os-window--dialog is-open" aria-label="カーネルパニック">
          <header className="os-titlebar tb-cherry">
            <h1 className="os-title">システムエラー</h1>
          </header>
          <div className="os-window-body">
            <div className="error-body">
              <div className="error-icon" aria-hidden="true">
                💣
              </div>
              <div className="error-code">ERROR 500</div>
              <p className="error-title">KERNEL PANIC</p>
              <p className="error-message">tomokiOSの内部でエラーが発生しました。カーネル（Next.js）は無事です。</p>
              <p className="error-hint">※インフラ層のせいではありません。たぶん。</p>
              <a className="os-button" href="/">
                再起動する
              </a>
            </div>
          </div>
          <footer className="os-statusbar">tomokiOS 26 ｜ コアは吐きませんでした</footer>
        </section>
      </main>
    </div>
  )
}
