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
    <td colSpan={2} className={`footer text-center bg-[#000000] ${className}`}>
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
    </td>
  )
}
