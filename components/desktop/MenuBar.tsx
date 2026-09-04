type MenuBarProps = {
  visitorsCount: string
}

type MenuItem = { label: string; action: string; arg?: string } | 'sep'

const APPLE_MENU: MenuItem[] = [
  { label: 'このOSについて', action: 'open', arg: 'about' },
  'sep',
  { label: 'システム設定…', action: 'open', arg: 'settings' },
  { label: 'Launchpad', action: 'launchpad' },
  { label: 'Mission Control', action: 'mission' },
  'sep',
  { label: '壁紙を変更', action: 'wallpaper' },
  { label: '再起動…', action: 'restart' },
]

const FILE_MENU: MenuItem[] = [
  { label: '新規ウィンドウ', action: 'reopen' },
  { label: 'しまう', action: 'minimize' },
  { label: '拡大 / 元に戻す', action: 'zoom' },
  'sep',
  { label: '閉じる', action: 'close' },
]

const VIEW_MENU: MenuItem[] = [
  { label: 'ウィンドウを整列', action: 'tidy' },
  { label: 'すべてしまう', action: 'minimize-all' },
  { label: 'Mission Control', action: 'mission' },
  'sep',
  { label: 'Spotlight 検索', action: 'spotlight' },
]

const HELP_MENU: MenuItem[] = [
  { label: 'ヒント', action: 'open', arg: 'tips' },
  { label: 'tomokiOS サポート', action: 'open', arg: 'support' },
  { label: 'ターミナルで help', action: 'open', arg: 'terminal' },
]

function Menu({ id, label, items, strong }: { id: string; label: string; items: MenuItem[]; strong?: boolean }) {
  return (
    <div className="os-menu" data-menu={id}>
      <button type="button" className={`os-mb-item${strong ? ' is-strong' : ''}`} data-menu-button>
        {label}
      </button>
      <div className="os-menu-drop" role="menu" hidden>
        {items.map((item, i) =>
          item === 'sep' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: 区切り線は位置そのものが意味を持つ
            <hr key={`sep-${i}`} />
          ) : (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              data-menu-action={item.action}
              data-menu-arg={item.arg}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export default function MenuBar({ visitorsCount }: MenuBarProps) {
  return (
    <header className="os-menubar">
      <div className="os-menubar-left">
        <div className="os-menu" data-menu="apple">
          <button type="button" className="os-logo" data-menu-button>
            🍈
          </button>
          <div className="os-menu-drop" role="menu" hidden>
            {APPLE_MENU.map((item, i) =>
              item === 'sep' ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: 区切り線は位置そのものが意味を持つ
                <hr key={`sep-${i}`} />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  data-menu-action={item.action}
                  data-menu-arg={item.arg}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
        </div>
        {/* いま手前にあるウィンドウの名前が入る（lib/os.ts が書き換える） */}
        <span className="os-mb-app" data-menubar-app>
          tomokiOS
        </span>
        <Menu id="file" label="ファイル" items={FILE_MENU} />
        <Menu id="view" label="表示" items={VIEW_MENU} />
        <Menu id="help" label="ヘルプ" items={HELP_MENU} />
      </div>
      <div className="os-menubar-right">
        <button type="button" className="os-mb-icon" data-spotlight-open aria-label="Spotlight 検索">
          🔍
        </button>
        <button type="button" className="os-mb-icon" data-notify-open aria-label="通知センター">
          🔔
        </button>
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
