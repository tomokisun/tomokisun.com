import type { AppContext } from '../../global'
import Desktop from '../templates/Desktop'

type HomePageProps = {
  c: AppContext
}

export default function HomePage({ c }: HomePageProps) {
  return <Desktop c={c} open={['profile', 'terminal']} />
}
