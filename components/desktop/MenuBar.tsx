type MenuBarProps = {
  visitorsCount: string
}

export default function MenuBar({ visitorsCount }: MenuBarProps) {
  return (
    <header className="os-menubar">
      <div className="os-menubar-left">
        <button type="button" className="os-logo" data-open="about">
          🍈 tomokiOS
        </button>
        <button type="button" className="os-mb-item" data-open="about">
          このOSについて
        </button>
        <button type="button" className="os-mb-item" data-open="terminal">
          ターミナル
        </button>
        <button type="button" className="os-mb-item" data-open="blog">
          ブログ
        </button>
        <button type="button" className="os-mb-item" data-open="settings">
          設定
        </button>
      </div>
      <div className="os-menubar-right">
        <span className="os-users">
          <span className="os-users-dot" aria-hidden="true" />
          {visitorsCount}人がログイン中
        </span>
        <span className="os-battery" title="640KBあればじゅうぶん">
          🔋64%
        </span>
        <time className="os-clock" data-clock>
          --:--
        </time>
      </div>
    </header>
  )
}
