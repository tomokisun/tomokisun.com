import Link from '../atoms/Link'

type FooterProps = {
  year?: number
  className?: string
}

export default function Footer({
  year = new Date().getFullYear(),
  className = ''
}: FooterProps) {
  return (
    <footer className={`grid-footer footer ${className}`}>
      <div>
        © {year} tomokisun
        {' | '}
        <Link
          href="https://github.com/tomokisun/tomokisun.com"
          target="_blank"
        >
          GitHub
        </Link>
      </div>
      <div className="best-viewed-banner">
        Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0 at 800x600 resolution
      </div>
    </footer>
  )
}
