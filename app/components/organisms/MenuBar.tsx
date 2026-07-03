type MenuBarProps = {
  visitorsCount: string
}

export default function MenuBar({ visitorsCount }: MenuBarProps) {
  return (
    <header className="os-menubar">
      <div className="os-menubar-left">
        <button type="button" className="os-logo" data-open="about">
          ⌘ tomokiOS
        </button>
        <button type="button" className="os-mb-item" data-open="about">
          このOSについて
        </button>
        <button type="button" className="os-mb-item" data-open="terminal">
          ターミナル
        </button>
      </div>
      <div className="os-menubar-right">
        <span className="os-users">
          <span className="os-users-dot" aria-hidden="true"></span>
          {visitorsCount}人がログイン中
        </span>
        <time className="os-clock" id="os-clock">
          --:--
        </time>
      </div>
    </header>
  )
}
