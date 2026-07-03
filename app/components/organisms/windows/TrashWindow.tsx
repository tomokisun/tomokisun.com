import Window from '../Window'

type TrashWindowProps = {
  open?: boolean
}

export default function TrashWindow({ open = false }: TrashWindowProps) {
  return (
    <Window id="trash" title="ゴミ箱" color="lavender" open={open} statusBar="1 項目 ｜ 4.2GB（重い）">
      <div className="trash-body">
        <div className="trash-item">
          <span className="os-icon-tile tile-dark" aria-hidden="true">
            🗜
          </span>
          <div className="trash-item-meta">
            <div className="trash-item-name">infra.zip</div>
            <div className="trash-item-desc">インフラ層一式（Kubernetes、Terraform、他）</div>
          </div>
        </div>
        <div className="trash-actions">
          <button type="button" className="os-button" data-trash-restore>
            復元
          </button>
          <button type="button" className="os-button os-button--danger" data-trash-empty>
            完全に削除
          </button>
        </div>
        <p className="trash-message" data-trash-message aria-live="polite"></p>
      </div>
    </Window>
  )
}
