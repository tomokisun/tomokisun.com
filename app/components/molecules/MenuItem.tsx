import Link from '../atoms/Link'

type MenuItemProps = {
  href: string
  children: any
  className?: string
}

export default function MenuItem({ href, children, className = '' }: MenuItemProps) {
  return (
    <div className={`menu-item ${className}`}>
      <Link href={href}>{children}</Link>
    </div>
  )
}
