type HeaderProps = {
  title: string
  showUnderConstruction?: boolean
  className?: string
}

export default function Header({ title, showUnderConstruction = true, className = '' }: HeaderProps) {
  return (
    <header className={`grid-header ${className}`}>
      <h1 className="blink">{title}</h1>
      {showUnderConstruction && (
        <div className="under-construction">
          <span className="construction-icon">🚧</span>
          <span>常に工事中</span>
          <span className="construction-icon">🔨</span>
        </div>
      )}
    </header>
  )
}
