export default function Notification() {
  return (
    <div className="sp-notification" role="status" aria-live="polite">
      <span className="sp-notification-icon">🗑</span>
      <div className="sp-notification-body">
        <div className="sp-notification-title">ゴミ箱</div>
        <div className="sp-notification-message">infra.zip がゴミ箱で3年間眠っています</div>
      </div>
      <button type="button" className="sp-notification-close" aria-label="通知を閉じる">
        ×
      </button>
    </div>
  )
}
