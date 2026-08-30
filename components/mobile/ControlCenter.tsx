export default function ControlCenter() {
  return (
    <>
      <div className="sp-cc-scrim" hidden></div>
      <div className="sp-cc" role="dialog" aria-modal="true" aria-label="コントロールセンター">
        <div className="sp-cc-grid">
          <button type="button" className="sp-cc-tile" data-cc="wallpaper">
            <span className="sp-cc-tile-main">🖼️ 壁紙</span>
            <span className="sp-cc-tile-sub" data-cc-wallpaper-label>
              ソーダ
            </span>
          </button>
          <button type="button" className="sp-cc-tile" data-cc="airplane" role="switch" aria-checked="false">
            <span className="sp-cc-tile-main">✈️ 機内モード</span>
            <span className="sp-cc-tile-sub">気持ちの問題</span>
          </button>
          <button type="button" className="sp-cc-tile" data-cc="lock">
            <span className="sp-cc-tile-main">🔒 画面ロック</span>
            <span className="sp-cc-tile-sub">もう一度ようこそ</span>
          </button>
          <button type="button" className="sp-cc-tile" data-cc="reboot">
            <span className="sp-cc-tile-main">🔄 再起動</span>
            <span className="sp-cc-tile-sub">なおるかも</span>
          </button>
          <button type="button" className="sp-cc-tile" data-cc="switcher">
            <span className="sp-cc-tile-main">🗂️ Appスイッチャー</span>
            <span className="sp-cc-tile-sub">ぜんぶ見える</span>
          </button>
        </div>
        <label className="sp-cc-slider">
          <span className="sp-cc-slider-label">☀️ まぶしさ</span>
          <input type="range" min="50" max="100" defaultValue="100" data-cc-brightness />
          <span className="sp-cc-slider-note" data-cc-brightness-note hidden>
            これ以上暗くすると寝ます
          </span>
        </label>
        <label className="sp-cc-slider">
          <span className="sp-cc-slider-label">🔊 おんりょう</span>
          <input type="range" min="0" max="100" defaultValue="0" data-cc-volume />
          <span className="sp-cc-slider-note" data-cc-volume-note hidden>
            このサイトに音はありません
          </span>
        </label>
        <div className="sp-cc-footer">AirDrop: 受信しない（何も来ないので）</div>
        <button type="button" className="sp-cc-grabber" aria-label="コントロールセンターを閉じる">
          <span aria-hidden="true"></span>
        </button>
      </div>
    </>
  )
}
