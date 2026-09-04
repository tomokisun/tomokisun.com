import { appBodies } from '@/components/apps'
import { pcApps, windowGeometry } from '@/data/apps'
import type { DeepLink } from '@/lib/deeplink'
import { openWindowIds } from '@/lib/deeplink'
import DesktopIcons from './DesktopIcons'
import Dock from './Dock'
import Launchpad from './Launchpad'
import MenuBar from './MenuBar'
import NotificationCenter from './NotificationCenter'
import Spotlight from './Spotlight'
import Window from './Window'
import BlogPostWindows from './windows/BlogPostWindows'
import ProductDetailWindows from './windows/ProductDetailWindows'

type DesktopProps = {
  visitorsCount: string
  deepLink?: DeepLink
}

// PC版デスクトップ。ウィンドウは data/apps.ts のレジストリから全部生やす。
export default function Desktop({ visitorsCount, deepLink }: DesktopProps) {
  const opened = openWindowIds(deepLink)
  return (
    <div className="os-desktop-shell">
      <MenuBar visitorsCount={visitorsCount} />
      <main id="main-content" className="os-desktop" data-desktop>
        <DesktopIcons />
        {pcApps.map((app, index) => {
          const Body = appBodies[app.id]
          if (!Body) return null
          const isOpen = opened.includes(app.id) || (app.id === 'profile' && opened.length === 0)
          return (
            <Window
              key={app.id}
              id={app.id}
              title={app.windowTitle ?? app.name}
              color={app.color}
              statusBar={app.statusBar ?? app.subtitle}
              geometry={windowGeometry(app, index)}
              open={isOpen}
            >
              <Body platform="pc" />
            </Window>
          )
        })}
        <ProductDetailWindows />
        <BlogPostWindows deepLink={deepLink} />
        <div className="os-mission" data-mission-view hidden>
          <span className="os-mission-hint">クリックでそのウィンドウへ ｜ Esc でもどる</span>
        </div>
      </main>
      <Dock />
      <Launchpad />
      <Spotlight />
      <NotificationCenter visitorsCount={visitorsCount} />
    </div>
  )
}
