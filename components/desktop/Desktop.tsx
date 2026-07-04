import DesktopIcons from './DesktopIcons'
import MenuBar from './MenuBar'
import AboutWindow from './windows/AboutWindow'
import ProductDetailWindows from './windows/ProductDetailWindows'
import ProductsWindow from './windows/ProductsWindow'
import ProfileWindow from './windows/ProfileWindow'
import SettingsWindow from './windows/SettingsWindow'
import SocialWindow from './windows/SocialWindow'
import TerminalWindow from './windows/TerminalWindow'
import TrashWindow from './windows/TrashWindow'

type DesktopProps = {
  visitorsCount: string
}

export default function Desktop({ visitorsCount }: DesktopProps) {
  return (
    <div className="os-desktop-shell">
      <MenuBar visitorsCount={visitorsCount} />
      <main id="main-content" className="os-desktop" data-desktop>
        <DesktopIcons />
        <ProfileWindow />
        <ProductsWindow />
        <ProductDetailWindows />
        <SocialWindow />
        <TerminalWindow />
        <TrashWindow />
        <SettingsWindow />
        <AboutWindow />
        <a className="os-icon os-icon--trash" href="#win-trash" data-open="trash">
          <span className="os-icon-tile tile-lavender" aria-hidden="true">
            🗑
          </span>
          <span className="os-icon-label">ゴミ箱</span>
        </a>
      </main>
    </div>
  )
}
