type AppIconProps = {
  label: string
  icon: string
  color: string
  opens: string
}

function AppIcon({ label, icon, color, opens }: AppIconProps) {
  return (
    <button type="button" className="sp-app-icon" data-sp-open={opens}>
      <span className={`sp-app-icon-tile tile-${color}`} aria-hidden="true">
        {icon}
      </span>
      <span className="sp-app-icon-label">{label}</span>
    </button>
  )
}

export default function HomeScreen() {
  return (
    <div className="sp-home">
      <button type="button" className="sp-widget" data-sp-open="profile" aria-label="プロフィールをひらく">
        <div className="sp-widget-avatar">🍈</div>
        <div className="sp-widget-info">
          <div className="sp-widget-name">tomokisun</div>
          <div className="sp-widget-role">iOS出身のなんでも屋</div>
        </div>
      </button>
      <AppIcon label="プロフィール" icon="📝" color="cherry" opens="profile" />
      <AppIcon label="Products" icon="📁" color="melon" opens="products" />
      <AppIcon label="ソーシャル" icon="🌐" color="soda" opens="social" />
      <AppIcon label="ブログ" icon="📰" color="cherry" opens="blog" />
      <AppIcon label="メモ帳" icon="📒" color="cream" opens="memo" />
      <AppIcon label="電卓" icon="🧮" color="soda" opens="calc" />
      <AppIcon label="設定" icon="⚙️" color="cream" opens="settings" />
      <AppIcon label="ゴミ箱" icon="🗑" color="lavender" opens="trash" />
      <AppIcon label="ターミナル" icon="＞_" color="dark" opens="terminal-blocked" />
      <a className="sp-app-icon" href="https://suzuri.jp/tomokisun" target="_blank" rel="noopener noreferrer">
        <span className="sp-app-icon-tile tile-melon" aria-hidden="true">
          🧢
        </span>
        <span className="sp-app-icon-label">グッズ</span>
      </a>
    </div>
  )
}
