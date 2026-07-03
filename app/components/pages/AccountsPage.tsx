import type { AppContext } from '../../global'
import Desktop from '../templates/Desktop'

type AccountsPageProps = {
  c: AppContext
}

export default function AccountsPage({ c }: AccountsPageProps) {
  return <Desktop c={c} open={['network']} />
}
