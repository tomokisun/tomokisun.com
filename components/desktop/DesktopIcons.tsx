type IconProps = {
  label: string
  glyph: string
  tile: string
  opens: string
}

function DesktopIcon({ label, glyph, tile, opens }: IconProps) {
  return (
    <a className="os-icon" href={`#win-${opens}`} data-open={opens}>
      <span className={`os-icon-tile tile-${tile}`} aria-hidden="true">
        {glyph}
      </span>
      <span className="os-icon-label">{label}</span>
    </a>
  )
}

export default function DesktopIcons() {
  return (
    <nav className="os-icons" aria-label="デスクトップ">
      <DesktopIcon label="プロフィール.txt" glyph="📝" tile="cherry" opens="profile" />
      <DesktopIcon label="Products" glyph="📁" tile="melon" opens="products" />
      <DesktopIcon label="ソーシャル" glyph="🌐" tile="soda" opens="social" />
      <DesktopIcon label="ブログ" glyph="📰" tile="cherry" opens="blog" />
      <DesktopIcon label="メモ帳" glyph="📒" tile="cream" opens="memo" />
      <DesktopIcon label="電卓" glyph="🧮" tile="soda" opens="calc" />
      <DesktopIcon label="ターミナル" glyph="＞_" tile="dark" opens="terminal" />
      <DesktopIcon label="設定" glyph="⚙️" tile="cream" opens="settings" />
    </nav>
  )
}
