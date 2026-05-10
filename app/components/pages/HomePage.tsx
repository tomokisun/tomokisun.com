import type { AppContext } from '../../global'
import Text from '../atoms/Text'
import Section from '../organisms/Section'
import PageLayout from '../templates/PageLayout'

type HomePageProps = {
  c: AppContext
}

export default function HomePage({ c }: HomePageProps) {
  return (
    <PageLayout c={c} title="tomokisunのホームページへようこそ">
      <div className="welcome-card">
        <div className="cute-menu">
          <div>
            <span className="deco-pink">♡</span> <a href="/">HOME</a> <span className="deco-pink">♡</span>
          </div>
          <div>
            <span className="deco-note">♪</span> <a href="#about">PROFILE</a> <span className="deco-note">♪</span>
          </div>
          <div>
            <a href="#job">DIARY</a> <span className="deco-purple">-お仕事日記-</span>
          </div>
          <div>
            <span className="deco-star">★</span> <a href="/products">あるばむ</a> <span className="deco-star">★</span>
          </div>
          <div>
            <span className="deco-diamond">◆</span> <a href="/accounts">BBS</a> <span className="deco-diamond">◆</span>
          </div>
          <div>
            <span className="deco-section">§</span>{' '}
            <a href="https://suzuri.jp/tomokisun" target="_blank" rel="noopener noreferrer">
              りんく
            </a>{' '}
            <span className="deco-section">§</span>
          </div>
        </div>
        <div className="welcome-divider">
          <span className="accent">♡</span>素通り禁止だヨ<span className="accent">♡</span>
        </div>
      </div>

      <Section id="about" title="♡ PROFILE ♡">
        <span className="name">tomokisun</span>
        <Text>
          元々はiOSエンジニアですが、現在はモバイル、ウェブ、バックエンド、ブロックチェーンなど、様々な分野に携わっています。
        </Text>
        <Text>ただ、インフラ層は得意ではないです（笑）</Text>
      </Section>

      <Section id="job" title="♪ DIARY -お仕事日記- ♪">
        <Text>
          <Text as="span" blink={true}>
            ★ ONE, Inc. - now ★
          </Text>
        </Text>
        <Text>友人と一緒にこの会社を共同設立しました。</Text>
        <Text>現在、10代向けのソーシャルモバイルアプリを開発中です。</Text>

        <Text>
          <Text as="span" blink={true}>
            ★ CAMPFIRE, Inc. - prev ★
          </Text>
        </Text>
        <Text>日本最大級のクラウドファンディングサイトの一つです。</Text>
        <Text>モバイルアプリのローンチを担当。</Text>
        <Text>
          立ち上げ期は3人のエンジニアで担当していましたが、その後はiOS、Android、APIサーバーなど、ほぼ一人ですべての開発を担当していました。
        </Text>
      </Section>
    </PageLayout>
  )
}
