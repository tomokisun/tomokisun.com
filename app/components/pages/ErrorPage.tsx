type ErrorPageProps = {
  code: number
  title: string
  message: string
}

export default function ErrorPage({ code, title, message }: ErrorPageProps) {
  return (
    <div className="os-root">
      <main id="main-content" className="os-desktop os-desktop--error">
        <section className="os-window os-window--dialog is-open" aria-label={title}>
          <header className="os-titlebar tb-pink">
            <h1 className="os-title">システムエラー</h1>
            <span className="os-titlebar-stripes" aria-hidden="true"></span>
          </header>
          <div className="os-window-body">
            <div className="error-body">
              <div className="error-icon" aria-hidden="true">
                💣
              </div>
              <div className="error-code">ERROR {code}</div>
              <p className="error-title">{title}</p>
              <p className="error-message">{message}</p>
              <p className="error-hint">再起動でだいたい直ります（このOSも例外ではありません）。</p>
              <a className="os-button" href="/">
                再起動する
              </a>
            </div>
          </div>
          <footer className="os-statusbar">tomokiOS 1.0 ｜ コアは吐きませんでした</footer>
        </section>
      </main>
    </div>
  )
}
