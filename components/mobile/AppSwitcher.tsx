export default function AppSwitcher() {
  return (
    <div className="sp-switcher" role="dialog" aria-modal="true" aria-label="Appスイッチャー" hidden>
      <p className="sp-switcher-empty" hidden>
        起動中のAppはありません。メモリ640KBの平和です
      </p>
      <div className="sp-switcher-rail">{/* カードはlib/sp/switcher.tsがrecentAppsから生成する */}</div>
      <button type="button" className="sp-switcher-killall os-button">
        すべて終了
      </button>
    </div>
  )
}
