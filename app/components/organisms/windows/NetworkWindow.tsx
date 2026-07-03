import { socialLinks } from '../../../data/social-links'
import Window from '../Window'

type NetworkWindowProps = {
  open?: boolean
}

export default function NetworkWindow({ open = false }: NetworkWindowProps) {
  return (
    <Window
      id="network"
      title="ネットワーク環境設定"
      color="blue"
      open={open}
      statusBar={`${socialLinks.length}つの接続がアクティブ`}
    >
      <ul className="net-list">
        {socialLinks.map((link) => (
          <li key={link.platform} className="net-row">
            <span className="net-dot net-dot--on" aria-hidden="true"></span>
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
          <span className="net-dot net-dot--off" aria-hidden="true"></span>
          <span className="net-platform">infra-layer.sys</span>
          <span className="net-value">接続できませんでした</span>
        </li>
      </ul>
    </Window>
  )
}
