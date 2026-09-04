import { dockApps } from '@/data/apps'

// macOSのDock。マウスを近づけると持ち上がり、開いているアプリの下に点がつく（lib/os.ts）。
// しまったウィンドウはこの右側の「棚」に積まれる。
export default function Dock() {
  return (
    <div className="os-dock-zone" data-dock-zone>
      <nav className="os-dock" aria-label="Dock" data-dock>
        {dockApps.map((app) => (
          <button key={app.id} type="button" className="os-dock-item" data-dock-app={app.id} data-open={app.id}>
            <span className={`os-dock-icon tile-${app.color}`} aria-hidden="true">
              {app.icon}
            </span>
            <span className="os-dock-label">{app.name}</span>
            <span className="os-dock-dot" aria-hidden="true" />
          </button>
        ))}
        <span className="os-dock-sep" aria-hidden="true" />
        <button type="button" className="os-dock-item" data-launchpad aria-label="Launchpad をひらく">
          <span className="os-dock-icon tile-lavender" aria-hidden="true">
            ⌘
          </span>
          <span className="os-dock-label">Launchpad</span>
        </button>
        <button type="button" className="os-dock-item" data-mission aria-label="Mission Control">
          <span className="os-dock-icon tile-melon" aria-hidden="true">
            ⬚
          </span>
          <span className="os-dock-label">Mission Control</span>
        </button>
        <span className="os-dock-sep" aria-hidden="true" />
        <span className="os-dock-shelf" data-dock-shelf />
        <button type="button" className="os-dock-item" data-open="trash">
          <span className="os-dock-icon tile-lavender" aria-hidden="true">
            🗑
          </span>
          <span className="os-dock-label">ゴミ箱</span>
        </button>
      </nav>
    </div>
  )
}
