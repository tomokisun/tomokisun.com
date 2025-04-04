import { Context } from 'hono'
import { Env } from 'hono'
import PageLayout from '../templates/PageLayout'
import Section from '../organisms/Section'
import Link from '../atoms/Link'

type AccountsPageProps = {
  c: Context<Env, any, {}>
}

export default function AccountsPage({ c }: AccountsPageProps) {
  return (
    <PageLayout c={c} title="tomokisunのアカウント一覧">
      <Section id="social" title="ソーシャル">
        <ul>
          <li>Email: <Link href="mailto:tomoki69386@gmail.com">tomoki69386@gmail.com</Link></li>
          <li>Facebook: <Link href="https://facebook.com/tomokisun" target="_blank">tomokisun</Link></li>
          <li>LinkedIn: <Link href="https://linkedin.com/in/tomokisun" target="_blank">tomokisun</Link></li>
          <li>Instagram: <Link href="https://instagram.com/tomokisun" target="_blank">tomokisun</Link></li>
          <li>Twitter: <Link href="https://twitter.com/tomokisun" target="_blank">tomokisun</Link></li>
          <li>Discord: tomokisun#1557</li>
          <li>Telegram: <Link href="https://t.me/tomokisun" target="_blank">tomokisun</Link></li>
          <li>Bondee: tomokisun</li>
          <li>ZEPETO: <Link href="https://web.zepeto.me/tomokisun" target="_blank">tomokisun</Link></li>
        </ul>
        <div className="marquee-container">
          <marquee scrollamount="3" behavior="alternate">ソーシャルメディアでフォローしてね 👀</marquee>
        </div>
      </Section>
    </PageLayout>
  )
}
