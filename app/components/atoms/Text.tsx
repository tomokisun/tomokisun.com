type TextProps = {
  children: any
  className?: string
  as?: 'p' | 'span' | 'div'
  blink?: boolean
}

export default function Text({ 
  children, 
  className = '', 
  as = 'p',
  blink = false
}: TextProps) {
  const blinkClass = blink ? 'blink' : '';
  
  if (as === 'span') {
    return <span className={`${blinkClass} ${className}`.trim()}>{children}</span>;
  } else if (as === 'div') {
    return <div className={`${blinkClass} ${className}`.trim()}>{children}</div>;
  } else {
    return <p className={`${blinkClass} ${className}`.trim()}>{children}</p>;
  }
}
