import { desktopApps } from '@/data/apps'

// デスクトップに出すのは「よく使う数個」だけ。残りはDockとLaunchpadから開く。
export default function DesktopIcons() {
  return (
    <nav className="os-icons" aria-label="デスクトップ">
      {desktopApps.map((app) => (
        <a key={app.id} className="os-icon" href={`#win-${app.id}`} data-open={app.id}>
          <span className={`os-icon-tile tile-${app.color}`} aria-hidden="true">
            {app.icon}
          </span>
          <span className="os-icon-label">{app.windowTitle?.endsWith('.txt') ? app.windowTitle : app.name}</span>
        </a>
      ))}
    </nav>
  )
}
