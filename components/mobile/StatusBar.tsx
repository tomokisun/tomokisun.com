export default function StatusBar() {
  return (
    <div className="sp-statusbar">
      <span className="sp-statusbar-carrier">ONE 5G</span>
      <time className="sp-statusbar-clock" data-clock>
        --:--
      </time>
      <span className="sp-statusbar-battery" title="640KBあればじゅうぶん">
        🔋64%
      </span>
    </div>
  )
}
