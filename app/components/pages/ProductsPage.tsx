import { Context } from 'hono'
import { Env } from 'hono'
import PageLayout from '../templates/PageLayout'
import Section from '../organisms/Section'
import Text from '../atoms/Text'
import Link from '../atoms/Link'

type ProductsPageProps = {
  c: Context<Env, any, {}>
}

export default function ProductsPage({ c }: ProductsPageProps) {
  return (
    <PageLayout c={c} title="tomokisunのプロダクト一覧">
      <Section id="calculatormultiple" title="CalculatorMultiple">
        <Text>デバイスを横向きにすると、3つの計算機が表示されます。同時に複数の計算が必要な場合に使用できます。</Text>
        <Text>
          <Link 
            href="https://apps.apple.com/ng/app/calculatormultiple/id1525626543" 
            target="_blank"
          >
            https://apps.apple.com/ng/app/calculatormultiple/id1525626543
          </Link>
        </Text>
      </Section>

      <Section id="blackjack" title="Blackjack Counting">
        <Text>このアプリを使えば、誰でも簡単にブラックジャックのカウンティングができます！</Text>
        <Text>
          <Link 
            href="https://apps.apple.com/ng/app/blackjack-counting/id1544949227" 
            target="_blank"
          >
            https://apps.apple.com/ng/app/blackjack-counting/id1544949227
          </Link>
        </Text>
      </Section>

      <Section id="supernft" title="Super NFT Products (acq: GMO Pepabo, Inc.)">
        <Text>あなたが所有するオリジナルNFT商品を購入できるサービスです。</Text>
        <Text>
          <Link 
            href="https://twitter.com/0xsnp" 
            target="_blank"
          >
            https://twitter.com/0xsnp
          </Link>
        </Text>
      </Section>

      <Section id="nererun" title="nererun">
        <Text>子供たちの睡眠をサポートするために、寝かしつけに特化した読み聞かせサービスです。</Text>
        <Text>
          <Link 
            href="https://nererunkids.studio.site/" 
            target="_blank"
          >
            https://nererunkids.studio.site/
          </Link>
        </Text>
      </Section>

      <Section id="pokerone" title="PokerONE (acq: deck, Inc.)">
        <Text>アミューズメントカジノのトーナメントを簡単に検索できるサービスです。</Text>
        <Text>
          <Link 
            href="https://twitter.com/pokerone_jp" 
            target="_blank"
          >
            https://twitter.com/pokerone_jp
          </Link>
        </Text>
        <div className="marquee-container">
          <marquee scrollamount="3" behavior="alternate">プロダクト一覧 👀</marquee>
        </div>
      </Section>
    </PageLayout>
  )
}
