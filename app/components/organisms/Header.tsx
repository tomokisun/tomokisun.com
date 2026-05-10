type HeaderProps = {
  visitorsCount?: string
  className?: string
}

export default function Header({ visitorsCount, className = '' }: HeaderProps) {
  return (
    <header className={`grid-header ${className}`}>
      <h1 className="site-title">
        tomokisun<span className="heart">♡</span>homepage
      </h1>
      <div className="site-subtitle">
        ☆<span className="star">─</span>‥… tomokisun ★ web ★ mobile ★ ios …‥<span className="star">─</span>☆
      </div>
      <div className="welcome-line">✦ WELCOME ✦</div>
      {visitorsCount && (
        <div className="visitor-line">
          ★ あなたは <span className="visitor-number">{visitorsCount}</span> 人目の訪問者 ★
        </div>
      )}
    </header>
  )
}
