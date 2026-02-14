import { socialLinks } from '../../data/social-links'
import type { AppContext } from '../../global'
import Link from '../atoms/Link'
import Marquee from '../atoms/Marquee'
import Section from '../organisms/Section'
import PageLayout from '../templates/PageLayout'

type AccountsPageProps = {
  c: AppContext
}

export default function AccountsPage({ c }: AccountsPageProps) {
  return (
    <PageLayout c={c} title="tomokisunのアカウント一覧">
      <Section id="social" title="ソーシャル">
        <ul>
          {socialLinks.map((link) => (
            <li key={link.platform}>
              {link.platform}:{' '}
              {link.url ? (
                <Link href={link.url} target={link.url.startsWith('mailto:') ? undefined : '_blank'}>
                  {link.display}
                </Link>
              ) : (
                link.display
              )}
            </li>
          ))}
        </ul>
        <Marquee text="ソーシャルメディアでフォローしてね 👀" speed="normal" direction="left" />
      </Section>
    </PageLayout>
  )
}
