import { Context } from 'hono'
import { Env } from 'hono'
import PageLayout from '../templates/PageLayout'
import Section from '../organisms/Section'
import Link from '../atoms/Link'

type SocialLink = {
  platform: string
  url?: string
  display: string
}

const socialLinks: SocialLink[] = [
  { platform: 'Email', url: 'mailto:tomoki69386@gmail.com', display: 'tomoki69386@gmail.com' },
  { platform: 'Facebook', url: 'https://facebook.com/tomokisun', display: 'tomokisun' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/tomokisun', display: 'tomokisun' },
  { platform: 'Instagram', url: 'https://instagram.com/tomokisun', display: 'tomokisun' },
  { platform: 'Twitter', url: 'https://twitter.com/tomokisun', display: 'tomokisun' },
  { platform: 'Discord', display: 'tomokisun#1557' },
  { platform: 'Telegram', url: 'https://t.me/tomokisun', display: 'tomokisun' },
  { platform: 'Bondee', display: 'tomokisun' },
  { platform: 'ZEPETO', url: 'https://web.zepeto.me/tomokisun', display: 'tomokisun' },
]

type AccountsPageProps = {
  c: Context<Env, any, {}>
}

export default function AccountsPage({ c }: AccountsPageProps) {
  return (
    <PageLayout c={c} title="tomokisunのアカウント一覧">
      <Section id="social" title="ソーシャル">
        <ul>
          {socialLinks.map((link) => (
            <li key={link.platform}>
              {link.platform}: {link.url ? (
                <Link href={link.url} target={link.url.startsWith('mailto:') ? undefined : '_blank'}>{link.display}</Link>
              ) : (
                link.display
              )}
            </li>
          ))}
        </ul>
        <div className="marquee-container">
          <marquee scrollamount="3" behavior="alternate">ソーシャルメディアでフォローしてね 👀</marquee>
        </div>
      </Section>
    </PageLayout>
  )
}
