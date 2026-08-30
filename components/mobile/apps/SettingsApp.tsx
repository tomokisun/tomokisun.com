export default function SettingsApp() {
  return (
    <div className="settings-list">
      <div className="settings-group-body">
        <div className="settings-row">
          <span className="settings-row-label">モデル名</span>
          <span className="settings-row-value">tomokiPhone</span>
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
          <span className="settings-row-value">639KB / 640KB 使用</span>
        </div>
      </div>
      <div className="settings-group-body">
        <button type="button" className="settings-row settings-row--action" data-sp-edit-home>
          <span className="settings-row-label">ホーム画面を編集</span>
          <span className="settings-row-value">アイコンが震えます</span>
        </button>
        <div className="settings-row">
          <span className="settings-row-label">ハプティクス</span>
          <span className="settings-row-value">気持ちだけ</span>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">バッテリーの状態</span>
          <span className="settings-row-value">最大容量 640KB（劣化なし。使っていないので）</span>
        </div>
      </div>
      <div className="settings-group-body">
        <div className="settings-row">
          <span className="settings-row-label">ソフトウェア・アップデート</span>
          <span className="settings-row-value">最新です。というより、これが全部です。</span>
        </div>
      </div>
    </div>
  )
}
