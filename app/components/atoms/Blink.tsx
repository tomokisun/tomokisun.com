import type { FC } from 'hono/jsx'

type BlinkProps = {
  children: any
  speed?: 'slow' | 'normal' | 'fast'
  className?: string
}

const Blink: FC<BlinkProps> = ({
  children,
  speed = 'normal',
  className = ''
}) => {
  // スピードに基づくアニメーション時間の設定
  const duration = {
    slow: '2s',
    normal: '1s',
    fast: '0.5s'
  }[speed]

  return (
    <span
      className={`blink ${className}`}
      role="presentation"
      style={{
        animation: `blink ${duration} step-end infinite`
      }}
    >
      {children}
      <style jsx>{`
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  )
}

export default Blink
