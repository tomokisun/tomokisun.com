import { FC } from 'hono/jsx'

type MarqueeProps = {
  text: string
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
  className?: string
}

export const Marquee: FC<MarqueeProps> = ({
  text,
  speed = 'normal',
  direction = 'left',
  className = ''
}) => {
  // スピードに基づくアニメーション時間の設定
  const duration = {
    slow: '20s',
    normal: '15s',
    fast: '10s'
  }[speed]

  // 方向に基づくアニメーション設定
  const directionStyle = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div
      class={`marquee-container ${className}`}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        padding: '5px 0'
      }}
    >
      <div
        class="marquee-content"
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: `marquee ${duration} linear infinite ${directionStyle}`
        }}
      >
        {text}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
