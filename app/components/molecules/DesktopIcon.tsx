type DesktopIconProps = {
  label: string
  glyph: string
  tile?: 'pink' | 'mint' | 'yellow' | 'blue' | 'purple' | 'dark'
  href: string
  opens?: string
  external?: boolean
}

export default function DesktopIcon({
  label,
  glyph,
  tile = 'yellow',
  href,
  opens,
  external = false,
}: DesktopIconProps) {
  return (
    <a
      className="os-icon"
      href={href}
      data-open={opens}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span className={`os-icon-tile tile-${tile}`} aria-hidden="true">
        {glyph}
      </span>
      <span className="os-icon-label">{label}</span>
    </a>
  )
}
