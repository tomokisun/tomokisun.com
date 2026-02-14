import { JSX } from 'hono/jsx/jsx-runtime'

type TextProps = {
  children: string | JSX.Element
  className?: string
  as?: 'p' | 'span' | 'div'
  blink?: boolean
}

export default function Text({
  children,
  className,
  as = 'p',
  blink = false
}: TextProps) {
  const composedClass = [blink && 'blink', className].filter(Boolean).join(' ');

  if (as === 'span') {
    return <span className={composedClass}>{children}</span>;
  } else if (as === 'div') {
    return <div className={composedClass}>{children}</div>;
  } else {
    return <p className={composedClass}>{children}</p>;
  }
}
