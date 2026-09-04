import { appsByCategory, CATEGORY_LABELS, pcApps } from '@/data/apps'

// Launchpad: 入っているアプリを全部並べる1枚。検索は Spotlight に任せて、ここは眺める場所。
export default function Launchpad() {
  return (
    <div className="os-launchpad" data-launchpad-view hidden>
      <div className="os-launchpad-head">
        <span className="os-launchpad-title">Launchpad</span>
        <span className="os-launchpad-sub">{pcApps.length} 個のアプリ ｜ ぜんぶプリインストール済み</span>
        <button type="button" className="os-button" data-launchpad-close>
          とじる
        </button>
      </div>
      <div className="os-launchpad-scroll">
        {appsByCategory(pcApps).map(([category, group]) => (
          <section key={category} className="os-launchpad-group">
            <h3 className="os-launchpad-group-title">{CATEGORY_LABELS[category]}</h3>
            <div className="os-launchpad-grid">
              {group.map((app) => (
                <button key={app.id} type="button" className="os-lp-item" data-open={app.id} data-launchpad-item>
                  <span className={`os-lp-icon tile-${app.color}`} aria-hidden="true">
                    {app.icon}
                  </span>
                  <span className="os-lp-name">{app.name}</span>
                  <span className="os-lp-sub">{app.subtitle}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
