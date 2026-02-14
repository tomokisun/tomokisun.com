import { JSX } from 'hono/jsx/jsx-runtime'

type BlinkProps = {
  children: JSX.Element | string
  speed?: 'slow' | 'normal' | 'fast'
  className?: string
}

export default function Blink({
  children,
  speed = 'normal',
  className = ''
}: BlinkProps) {
  const speedClass = speed !== 'normal' ? `blink--${speed}` : ''
  return (
    <span className={`blink ${speedClass} ${className}`} role="presentation">
      {children}
    </span>
  )
}
