import type { ComponentType } from 'react'
import { BlogAppBody, ProductsBody } from '@/components/apps/core'
import type { AppBodyProps } from '@/components/apps/kit'
import { spApps } from '@/data/apps'
import AppSwitcher from './AppSwitcher'
import AppView from './AppView'
import ControlCenter from './ControlCenter'
import Dock from './Dock'
import HomeScreen from './HomeScreen'
import LockScreen from './LockScreen'
import Notification from './Notification'
import SearchSheet from './SearchSheet'
import StatusBar from './StatusBar'
import TerminalBlockedDialog from './TerminalBlockedDialog'

// PCのウィンドウとは形が違うため、SP専用に描くアプリ
const SP_SPECIFIC: Record<string, ComponentType<AppBodyProps>> = {
  blog: BlogAppBody,
  products: ProductsBody,
}

type MobileShellProps = {
  visitorsCount: string
}

// SP版ホーム画面一式。アプリ画面は data/apps.ts のレジストリから全部生やす。
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
      <SearchSheet />
      <div className="sp-screen-filter" aria-hidden="true"></div>

      {/*
        アプリの中身はPC側のウィンドウに1つだけ描かれていて、SPではここへ引っ越してくる
        （lib/os/adopt.ts）。形がPCと違うブログとProductsだけは、SP専用の本体を持つ。
      */}
      {spApps.map((app) => {
        const Body = SP_SPECIFIC[app.id]
        return (
          <AppView key={app.id} id={app.id} title={app.name} color={app.color}>
            {Body ? <Body platform="sp" /> : undefined}
          </AppView>
        )
      })}
      <TerminalBlockedDialog />
    </div>
  )
}
