import Marquee from '../atoms/Marquee'

type ErrorPageProps = {
  code: number
  title: string
  message: string
  marqueeText: string
}

export default function ErrorPage({ code, title, message, marqueeText }: ErrorPageProps) {
  return (
    <div className="container">
      <div className="layout-grid layout-grid--single-column">
        <header className="grid-header">
          <h1 className="blink">{code} Error</h1>
        </header>
        <main className="grid-content">
          <div className="content">
            <section className="section">
              <h2 className="section-header">
                {title}
              </h2>
              <div className="section-content">
                <p>{message}</p>
                <Marquee text={marqueeText} speed="normal" direction="left" />
                <p className="error-back-link">
                  <a href="/" className="home-link">Back to Home</a>
                </p>
              </div>
            </section>
          </div>
        </main>
        <footer className="grid-footer footer">
          <div>© 2025 tomokisun's Homepage</div>
        </footer>
      </div>
    </div>
  )
}
