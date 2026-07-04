export default function Dock() {
  return (
    <nav className="sp-dock" aria-label="ドック">
      <button type="button" className="sp-app-icon" data-sp-open="profile">
        <span className="sp-app-icon-tile tile-cherry" aria-hidden="true">
          📝
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="products">
        <span className="sp-app-icon-tile tile-melon" aria-hidden="true">
          📁
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="social">
        <span className="sp-app-icon-tile tile-soda" aria-hidden="true">
          🌐
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="trash">
        <span className="sp-app-icon-tile tile-lavender" aria-hidden="true">
          🗑
        </span>
      </button>
      <div className="sp-home-indicator" aria-hidden="true" />
    </nav>
  )
}
