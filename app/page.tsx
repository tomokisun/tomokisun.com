import Desktop from '@/components/desktop/Desktop'
import MobileShell from '@/components/mobile/MobileShell'
import OsClient from '@/components/OsClient'
import { incrementVisitorsCount } from '@/lib/visitors'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const visitorsCount = await incrementVisitorsCount()

  return (
    <div className="os-root">
      <h1 className="sr-only">tomokisunのホームページ — tomokiOS 26</h1>
      <Desktop visitorsCount={visitorsCount} />
      <MobileShell visitorsCount={visitorsCount} />
      <OsClient />
    </div>
  )
}
