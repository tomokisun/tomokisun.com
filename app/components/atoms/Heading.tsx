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
  const blinkClass = blink ? 'blink' : '';
  
  return createElement(
    `h${level}`,
    { className: `${blinkClass} ${className}`.trim() },
    children
  )
}
