import Window from '../Window'

export default function SettingsWindow() {
  return (
    <Window id="settings" title="設定" color="cream" statusBar="tomokiOS 26.0.4 (Build 2006A)">
      <div className="settings-list">
        <div className="settings-group-body">
          <div className="settings-row">
            <span className="settings-row-label">壁紙</span>
            <span className="settings-row-value">右クリックメニューから変更</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">サウンド</span>
            <span className="settings-row-value">OFF（静かなOS）</span>
          </div>
        </div>
        <div className="settings-group-body">
          <div className="settings-row">
            <span className="settings-row-label">モデル名</span>
            <span className="settings-row-value">tomokiBook</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">OS</span>
            <span className="settings-row-value">tomokiOS 26 "Cream Soda"</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">ビルド</span>
            <span className="settings-row-value">2006A</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">ストレージ</span>
            <span className="settings-row-value">639KB / 640KB 使用（じゅうぶん）</span>
          </div>
        </div>
        <div className="settings-group-body">
          <div className="settings-row">
            <span className="settings-row-label">ソフトウェア・アップデート</span>
            <span className="settings-row-value">最新です。というより、これが全部です。</span>
          </div>
        </div>
      </div>
    </Window>
  )
}
