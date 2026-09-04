// SP版のSpotlight。ホーム画面を下に引っぱるか、検索ピルを押すと出る。
// 候補づくりは lib/os/search.ts（PCのSpotlightと共通）。
export default function SearchSheet() {
  return (
    <div className="sp-search" data-sp-search hidden>
      <div className="sp-search-box" role="dialog" aria-modal="true" aria-label="検索">
        <div className="sp-search-field">
          <span aria-hidden="true">🔍</span>
          <input
            className="sp-search-input"
            type="text"
            data-sp-search-input
            placeholder="Appと記事を検索"
            aria-label="Appと記事を検索"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="sp-search-cancel" data-sp-search-close>
            キャンセル
          </button>
        </div>
        <ul className="sp-search-results" data-sp-search-results />
      </div>
    </div>
  )
}
