import { Context } from 'hono'
import { Env } from 'hono'
import PageLayout from '../templates/PageLayout'
import Section from '../organisms/Section'
import Text from '../atoms/Text'
import Guestbook from '../../islands/Guestbook'

type HomePageProps = {
  c: Context<Env, any, {}>
}

export default function HomePage({ c }: HomePageProps) {
  return (
    <PageLayout c={c} title="tomokisunのホームページへようこそ">
      <a name="about"></a>
      <Section id="about" title="自己紹介">
        <span className="name">tomokisun</span>
        <Text>元々はiOSエンジニアですが、現在はモバイル、ウェブ、バックエンド、ブロックチェーンなど、様々な分野に携わっています。</Text>
        <Text>ただ、インフラ層は得意ではないです（笑）</Text>
        <div className="marquee-container">
          <marquee scrollamount="3" behavior="alternate">個人ウェブサイト 👀</marquee>
        </div>
      </Section>
      
      <hr className="rainbow" />
      
      <a name="job"></a>
      <Section id="job" title="職歴">
        <Text><Text as="span" blink={true}>ONE, Inc. - now</Text></Text>
        <Text>友人と一緒にこの会社を共同設立しました。</Text>
        <Text>現在、10代向けのソーシャルモバイルアプリを開発中です。</Text>
        
        <Text><Text as="span" blink={true}>CAMPFIRE, Inc. - prev</Text></Text>
        <Text>日本最大級のクラウドファンディングサイトの一つです。</Text>
        <Text>モバイルアプリのローンチを担当。</Text>
        <Text>立ち上げ期は3人のエンジニアで担当していましたが、その後はiOS、Android、APIサーバーなど、ほぼ一人ですべての開発を担当していました。</Text>
      </Section>
      
      <hr className="rainbow" />
      
      <Guestbook />
    </PageLayout>
  )
}
