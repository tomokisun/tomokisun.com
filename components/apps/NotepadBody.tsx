// メモ帳の中身。PCウィンドウ（NotepadWindow）とSPアプリ（NotepadApp）で共有する。
// 動きは lib/apps/notepad.ts が [data-memo] を拾って付ける。

const DEFAULT_MEMO = `やること
・インフラを勉強する（2019年から書いてある）
・ブログの2記事目を書く
・このメモを保存する ← 押せます。残りません。`

export default function NotepadBody() {
  return (
    <div className="memo" data-memo>
      <textarea
        className="memo-paper"
        data-memo-text
        aria-label="メモ本文"
        spellCheck={false}
        placeholder="ここに書けます。保存もできます。ただし残りません。"
        defaultValue={DEFAULT_MEMO}
      />
      <div className="memo-toolbar">
        <button type="button" className="os-button" data-memo-save>
          保存
        </button>
        <button type="button" className="os-button os-button--danger" data-memo-clear>
          ぜんぶ消す
        </button>
        <span className="memo-status">
          <span data-memo-count>0文字</span>
          <span className="memo-state" data-memo-state>
            未保存（自動保存はOFF）
          </span>
        </span>
      </div>
      <p className="memo-message" data-memo-message aria-live="polite" />
    </div>
  )
}
