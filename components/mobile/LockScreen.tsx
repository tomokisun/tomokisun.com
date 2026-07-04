type LockScreenProps = {
  visitorsCount: string
}

export default function LockScreen({ visitorsCount }: LockScreenProps) {
  return (
    <div className="sp-lockscreen">
      <div className="sp-lock-clock" data-clock>
        --:--
      </div>
      <div className="sp-lock-date">
        {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
      </div>
      <div className="sp-lock-notification">
        <span className="sp-lock-notif-icon">📬</span>
        <span className="sp-lock-notif-text">ようこそ！あなたは{visitorsCount}人目の訪問者です</span>
      </div>
      <div className="sp-lock-hint">タップしてログイン（素通り禁止）</div>
    </div>
  )
}
