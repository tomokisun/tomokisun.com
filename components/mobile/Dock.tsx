export default function Dock() {
  return (
    <nav className="sp-dock" aria-label="ドック">
      <button type="button" className="sp-app-icon" data-sp-open="profile" aria-label="プロフィール">
        <span className="sp-app-icon-tile tile-cherry" aria-hidden="true">
          📝
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="products" aria-label="Products">
        <span className="sp-app-icon-tile tile-melon" aria-hidden="true">
          📁
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="social" aria-label="ソーシャル">
        <span className="sp-app-icon-tile tile-soda" aria-hidden="true">
          🌐
        </span>
      </button>
      <button type="button" className="sp-app-icon" data-sp-open="trash" aria-label="ゴミ箱">
        <span className="sp-app-icon-tile tile-lavender" aria-hidden="true">
          🗑
        </span>
      </button>
      <div className="sp-home-indicator" aria-hidden="true" />
    </nav>
  )
}
