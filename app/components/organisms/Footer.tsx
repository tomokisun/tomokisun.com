import Link from '../atoms/Link'

type FooterProps = {
  year?: number
  className?: string
}

export default function Footer({ year = new Date().getFullYear(), className = '' }: FooterProps) {
  return (
    <footer className={`grid-footer footer ${className}`}>
      <div>
        無料ホムペ作成♪着うたは{' '}
        <Link href="https://github.com/tomokisun/tomokisun.com" target="_blank">
          GitHub
        </Link>
        {' | '}© {year} tomokisun
      </div>
    </footer>
  )
}
