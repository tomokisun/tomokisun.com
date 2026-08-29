export default function StatusBar() {
  return (
    <div className="sp-statusbar">
      <button type="button" className="sp-statusbar-carrier" data-carrier>
        ONE 5G
      </button>
      <time className="sp-statusbar-clock" data-clock>
        --:--
      </time>
      <button
        type="button"
        className="sp-statusbar-battery"
        data-cc-open
        aria-expanded="false"
        aria-label="コントロールセンターをひらく"
        title="640KBあればじゅうぶん"
      >
        🔋64%
      </button>
    </div>
  )
}
