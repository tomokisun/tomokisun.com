import AppView from './AppView'
import ProductsApp from './apps/ProductsApp'
import ProfileApp from './apps/ProfileApp'
import SettingsApp from './apps/SettingsApp'
import SocialApp from './apps/SocialApp'
import TrashApp from './apps/TrashApp'
import Dock from './Dock'
import HomeScreen from './HomeScreen'
import LockScreen from './LockScreen'
import Notification from './Notification'
import StatusBar from './StatusBar'
import TerminalBlockedDialog from './TerminalBlockedDialog'

type MobileShellProps = {
  visitorsCount: string
}

export default function MobileShell({ visitorsCount }: MobileShellProps) {
  return (
    <div className="sp-shell">
      <StatusBar />
      <HomeScreen />
      <Dock />
      <LockScreen visitorsCount={visitorsCount} />
      <Notification />

      <AppView id="profile" title="プロフィール" color="cherry">
        <ProfileApp />
      </AppView>
      <AppView id="products" title="Products" color="melon">
        <ProductsApp />
      </AppView>
      <AppView id="social" title="ソーシャル" color="soda">
        <SocialApp />
      </AppView>
      <AppView id="trash" title="ゴミ箱" color="lavender">
        <TrashApp />
      </AppView>
      <AppView id="settings" title="設定" color="cream">
        <SettingsApp />
      </AppView>
      <TerminalBlockedDialog />
    </div>
  )
}
