import type { JSX } from 'hono/jsx/jsx-runtime'
import Link from '../atoms/Link'

type MenuItemProps = {
  href: string
  children: JSX.Element | string
  className?: string
}

export default function MenuItem({ href, children, className = '' }: MenuItemProps) {
  return (
    <div className={`menu-item ${className}`}>
      <Link href={href}>{children}</Link>
    </div>
  )
}
