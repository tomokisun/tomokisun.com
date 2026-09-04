import Desktop from '@/components/desktop/Desktop'
import MobileShell from '@/components/mobile/MobileShell'
import OsClient from '@/components/OsClient'
import type { DeepLink } from '@/lib/deeplink'
import { incrementVisitorsCount } from '@/lib/visitors'

type OsPageProps = {
  /** ページのh1（画面には出さない。OSのクロームがタイトルを持っているため） */
  heading: string
  /** URLから起動するアプリ。未指定ならデスクトップ／ホーム画面のまま */
  deepLink?: DeepLink
}

// tomokiOSの唯一の入口。どのURLで来てもOSが起動し、アプリはOSの中だけで開く。
export default async function OsPage({ heading, deepLink }: OsPageProps) {
  const visitorsCount = await incrementVisitorsCount()

  return (
    <div className="os-root">
      <h1 className="sr-only">{heading}</h1>
      <Desktop visitorsCount={visitorsCount} deepLink={deepLink} />
      <MobileShell visitorsCount={visitorsCount} />
      <OsClient deepLink={deepLink} />
    </div>
  )
}
