import type { JSX } from 'hono/jsx/jsx-runtime'

type LinkProps = {
  href: string
  children: JSX.Element | string
  className?: string
  target?: string
  rel?: string
}

export default function Link({ href, children, className = '', target = '', rel = '' }: LinkProps) {
  const externalProps = target === '_blank' ? { rel: rel || 'noopener noreferrer' } : {}

  return (
    <a href={href} className={className} target={target || undefined} {...externalProps}>
      {children}
    </a>
  )
}
