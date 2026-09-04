import { spDockApps } from '@/data/apps'

export default function Dock() {
  return (
    <nav className="sp-dock" aria-label="ドック">
      {spDockApps.map((app) => (
        <button key={app.id} type="button" className="sp-app-icon" data-sp-open={app.id} aria-label={app.name}>
          <span className={`sp-app-icon-tile tile-${app.color}`} aria-hidden="true">
            {app.icon}
          </span>
        </button>
      ))}
      <div className="sp-home-indicator" aria-hidden="true" />
    </nav>
  )
}
