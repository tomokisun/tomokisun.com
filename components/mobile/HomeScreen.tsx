import { appsByCategory, CATEGORY_LABELS, SP_HOME_PAGES, spApps, spHomePage } from '@/data/apps'

function AppIcon({ id, icon, label, color }: { id: string; icon: string; label: string; color: string }) {
  return (
    <button type="button" className="sp-app-icon" data-sp-open={id}>
      <span className={`sp-app-icon-tile tile-${color}`} aria-hidden="true">
        {icon}
      </span>
      <span className="sp-app-icon-label">{label}</span>
    </button>
  )
}

// ホーム画面。ページを横に並べたレールをスワイプでめくる（lib/sp/home.ts）。
// いちばん最後のページはApp Library（カテゴリ別の全アプリ）。
export default function HomeScreen() {
  const pages = Array.from({ length: SP_HOME_PAGES }, (_, i) => i)
  return (
    <div className="sp-home" data-sp-home>
      <div className="sp-home-rail" data-sp-home-rail>
        {pages.map((page) => (
          <section key={page} className="sp-home-page" data-home-page={page} aria-label={`ホーム ${page + 1}ページ目`}>
            {page === 0 && (
              <div className="sp-widget-row">
                <button type="button" className="sp-widget" data-sp-open="profile" aria-label="プロフィールをひらく">
                  <div className="sp-widget-avatar">🍈</div>
                  <div className="sp-widget-info">
                    <div className="sp-widget-name">tomokisun</div>
                    <div className="sp-widget-role">iOS出身のなんでも屋</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="sp-widget sp-widget--small tile-soda"
                  data-sp-open="weather"
                  aria-label="天気をひらく"
                >
                  <div className="sp-widget-emoji">☀️</div>
                  <div className="sp-widget-info">
                    <div className="sp-widget-name">24°</div>
                    <div className="sp-widget-role">机の上</div>
                  </div>
                </button>
              </div>
            )}
            <div className="sp-home-grid">
              {spHomePage(page).map((app) => (
                <AppIcon key={app.id} id={app.id} icon={app.icon} label={app.name} color={app.color} />
              ))}
              {page === 0 && <AppIcon id="terminal-blocked" icon="＞_" label="ターミナル" color="dark" />}
            </div>
          </section>
        ))}
        <section className="sp-home-page sp-applib" data-home-page={SP_HOME_PAGES} aria-label="App ライブラリ">
          <div className="sp-applib-title">App ライブラリ</div>
          {appsByCategory(spApps).map(([category, group]) => (
            <div key={category} className="sp-applib-group">
              <div className="sp-applib-group-title">{CATEGORY_LABELS[category]}</div>
              <div className="sp-applib-grid">
                {group.map((app) => (
                  <AppIcon key={app.id} id={app.id} icon={app.icon} label={app.name} color={app.color} />
                ))}
              </div>
            </div>
          ))}
          <p className="sp-applib-note">
            {spApps.length}個ぜんぶ入っています。ホーム画面に出していないアプリも、ここから開けます。
          </p>
        </section>
      </div>
      <nav className="sp-page-dots" data-sp-dots aria-label="ホーム画面のページ">
        {[...pages, SP_HOME_PAGES].map((page) => (
          <button
            key={page}
            type="button"
            className="sp-page-dot"
            data-sp-dot={page}
            aria-label={page === SP_HOME_PAGES ? 'App ライブラリ' : `${page + 1}ページ目`}
          />
        ))}
      </nav>
    </div>
  )
}
