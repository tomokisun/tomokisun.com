import Window from '../Window'

export default function TrashWindow() {
  return (
    <Window id="trash" title="ゴミ箱" color="lavender" statusBar="1 項目 ｜ 3.2 GB（ほぼ後悔）">
      <div className="trash-body">
        <div className="trash-item">
          <span className="os-icon-tile tile-dark" aria-hidden="true">
            🗜
          </span>
          <div className="trash-item-meta">
            <div className="trash-item-name">infra.zip（3.2GB）</div>
            <div className="trash-item-desc">インフラ層一式（Kubernetes、Terraform、他）— 削除日: だいぶ前</div>
          </div>
        </div>
        <div className="trash-actions">
          <button type="button" className="os-button" data-trash-restore>
            復元
          </button>
          <button type="button" className="os-button os-button--danger" data-trash-empty>
            ゴミ箱を空にする
          </button>
        </div>
        <p className="trash-message" data-trash-message aria-live="polite" />
      </div>
    </Window>
  )
}
