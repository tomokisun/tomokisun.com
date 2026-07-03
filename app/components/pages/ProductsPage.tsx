import type { AppContext } from '../../global'
import Desktop from '../templates/Desktop'

type ProductsPageProps = {
  c: AppContext
}

export default function ProductsPage({ c }: ProductsPageProps) {
  return <Desktop c={c} open={['products']} />
}
