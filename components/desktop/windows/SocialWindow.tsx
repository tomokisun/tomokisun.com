import { socialLinks } from '@/data/social-links'
import Window from '../Window'

export default function SocialWindow() {
  return (
    <Window
      id="social"
      title="ネットワーク環境設定"
      color="soda"
      statusBar={`${socialLinks.length} 接続済み ｜ 1 失敗（想定内）`}
    >
      <ul className="net-list">
        {socialLinks.map((link) => (
          <li key={link.platform} className="net-row">
            <span className="net-dot net-dot--on" aria-hidden="true" />
            <span className="net-platform">{link.platform}</span>
            <span className="net-value">
              {link.url ? (
                <a
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                >
                  {link.display}
                </a>
              ) : (
                link.display
              )}
            </span>
          </li>
        ))}
        <li className="net-row net-row--error">
          <span className="net-dot net-dot--off" aria-hidden="true" />
          <span className="net-platform">infra-layer.sys</span>
          <span className="net-value">接続に失敗しました（再試行しない）</span>
        </li>
      </ul>
    </Window>
  )
}
