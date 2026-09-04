// Spotlight: ⌘K / ⌘Space / メニューバーの🔍 でひらく検索。
// 候補は lib/os/spotlight.ts が data/apps.ts とブログ・プロダクトから作る。
export default function Spotlight() {
  return (
    <div className="os-spotlight" data-spotlight hidden>
      <div className="os-spotlight-box" role="dialog" aria-modal="true" aria-label="Spotlight 検索">
        <div className="os-spotlight-field">
          <span aria-hidden="true">🔍</span>
          <input
            className="os-spotlight-input"
            type="text"
            data-spotlight-input
            placeholder="tomokiOS 検索"
            aria-label="tomokiOS 検索"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <ul className="os-spotlight-results" data-spotlight-results />
        <div className="os-spotlight-foot">↑↓ で選択 ｜ Enter でひらく ｜ Esc でとじる</div>
      </div>
    </div>
  )
}
