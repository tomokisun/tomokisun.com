import { createElement } from 'hono/jsx'
import { JSX } from 'hono/jsx/jsx-runtime'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: JSX.Element
  className?: string
  blink?: boolean
}

export default function Heading({ 
  level = 1, 
  children, 
  className = '',
  blink = false
}: HeadingProps) {
  return createElement(
    `h${level}`,
    { className: [blink && 'blink', className].filter(Boolean).join(' ') || undefined },
    children
  )
}
