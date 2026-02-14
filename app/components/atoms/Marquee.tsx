type MarqueeProps = {
  text: string
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
  className?: string
}

export default function Marquee({
  text,
  speed = 'normal',
  direction = 'left',
  className = ''
}: MarqueeProps) {
  const duration = {
    slow: '20s',
    normal: '15s',
    fast: '10s'
  }[speed]

  const directionStyle = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div
      className={`marquee-container ${className}`}
      role="marquee"
      aria-label="スクロールテキスト"
    >
      <div
        className="marquee-content"
        style={{
          animation: `marquee ${duration} linear infinite ${directionStyle}`
        }}
      >
        {text}
      </div>
    </div>
  )
}
