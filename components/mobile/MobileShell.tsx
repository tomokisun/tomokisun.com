import CalculatorBody from '../apps/CalculatorBody'
import NotepadBody from '../apps/NotepadBody'
import AppSwitcher from './AppSwitcher'
import AppView from './AppView'
import BlogApp from './apps/BlogApp'
import ProductsApp from './apps/ProductsApp'
import ProfileApp from './apps/ProfileApp'
import SettingsApp from './apps/SettingsApp'
import SocialApp from './apps/SocialApp'
import TrashApp from './apps/TrashApp'
import ControlCenter from './ControlCenter'
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
      <ControlCenter />
      <AppSwitcher />
      <div className="sp-screen-filter" aria-hidden="true"></div>

      <AppView id="profile" title="プロフィール" color="cherry">
        <ProfileApp />
      </AppView>
      <AppView id="products" title="Products" color="melon">
        <ProductsApp />
      </AppView>
      <AppView id="social" title="ソーシャル" color="soda">
        <SocialApp />
      </AppView>
      <AppView id="blog" title="ブログ" color="cherry">
        <BlogApp />
      </AppView>
      <AppView id="memo" title="メモ帳" color="cream">
        <NotepadBody />
      </AppView>
      <AppView id="calc" title="電卓" color="soda">
        <CalculatorBody />
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
