import type { AppContext } from '../../global'
import { getVisitorsCount } from '../../utils/visitors'
import DesktopIcon from '../molecules/DesktopIcon'
import MenuBar from '../organisms/MenuBar'
import AboutWindow from '../organisms/windows/AboutWindow'
import NetworkWindow from '../organisms/windows/NetworkWindow'
import ProductsWindow from '../organisms/windows/ProductsWindow'
import ProductWindows from '../organisms/windows/ProductWindows'
import ProfileWindow from '../organisms/windows/ProfileWindow'
import TerminalWindow from '../organisms/windows/TerminalWindow'
import TrashWindow from '../organisms/windows/TrashWindow'

export type DesktopProps = {
  c: AppContext
  open?: string[]
}

export default async function Desktop({ c, open = ['profile'] }: DesktopProps) {
  const visitorsCount = await getVisitorsCount(c)
  const isOpen = (id: string) => open.includes(id)

  return (
    <div className="os-root">
      <h1 className="sr-only">tomokisunのホームページ — tomokiOS</h1>
      <MenuBar visitorsCount={visitorsCount} />
      <main id="main-content" className="os-desktop" data-desktop>
        <nav className="os-icons" aria-label="デスクトップ">
          <DesktopIcon label="プロフィール.txt" glyph="📝" tile="pink" href="/" opens="profile" />
          <DesktopIcon label="products" glyph="📁" tile="yellow" href="/products" opens="products" />
          <DesktopIcon label="ネットワーク" glyph="🌐" tile="blue" href="/accounts" opens="network" />
          <DesktopIcon label="ターミナル" glyph="＞_" tile="dark" href="#win-terminal" opens="terminal" />
          <DesktopIcon label="グッズ.url" glyph="🧢" tile="mint" href="https://suzuri.jp/tomokisun" external />
        </nav>

        <ProfileWindow open={isOpen('profile')} />
        <ProductsWindow open={isOpen('products')} />
        <ProductWindows />
        <NetworkWindow open={isOpen('network')} />
        <TerminalWindow open={isOpen('terminal')} />
        <TrashWindow open={isOpen('trash')} />
        <AboutWindow open={isOpen('about')} />

        <a className="os-icon os-icon--trash" href="#win-trash" data-open="trash">
          <span className="os-icon-tile tile-lavender" aria-hidden="true">
            🗑
          </span>
          <span className="os-icon-label">ゴミ箱（infra.zip）</span>
        </a>
      </main>
    </div>
  )
}
