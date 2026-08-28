import type { Metadata } from 'next'
import Link from 'next/link'
import BlogShell from '@/components/blog/BlogShell'

const TITLE = 'Wablo'
const DESCRIPTION =
  '友だちに30秒の落書きを送るiOSアプリ「Wablo」の話。テキストも写真もフィードもなし。へたな絵ほど、よく届きます。'
const URL = 'https://tomokisun.com/blog/wablo'
const PUBLISHED = '2026-08-28'

export const metadata: Metadata = {
  title: `${TITLE} | tomokiOS 26 ブログ`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'tomokiOS 26',
    title: TITLE,
    type: 'article',
    publishedTime: PUBLISHED,
    authors: ['tomokisun'],
    images: '/ogp.png',
    url: URL,
    description: DESCRIPTION,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tomokisun',
    creator: '@tomokisun',
    title: TITLE,
    description: DESCRIPTION,
    images: '/ogp.png',
  },
}

export default function WabloPostPage() {
  return (
    <BlogShell title="wablo.md" statusBar="UTF-8 ｜ Markdown ｜ 読了まで: 30秒ではたぶん無理">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires raw script injection
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            url: URL,
            mainEntityOfPage: URL,
            author: {
              '@type': 'Person',
              name: 'tomokisun',
              url: 'https://tomokisun.com',
            },
          }),
        }}
      />
      <article className="blog-article">
        <h1 className="blog-title">Wablo</h1>
        <time className="blog-date" dateTime={PUBLISHED}>
          2026.08.28
        </time>

        <p className="blog-lead">
          <a href="https://wablo.app" target="_blank" rel="noopener noreferrer">
            Wablo
          </a>
          は、友だちに30秒の落書きを送るための iOS
          アプリです。テキストなし、写真なし、スタンプなし。指で描いたぐにゃぐにゃの線が、そのままカードになって友だちの机の上に積まれます。友人と共同創業した
          ONE, Inc. で、いま作っています
          <sup id="ref-1">
            <a href="#fn-1">1</a>
          </sup>
          。
        </p>

        <h2>なんで落書きなのか</h2>
        <p>
          メッセージアプリを開くと、まず「なにを書くか」を考えることになります。写真を送るなら「どれを選ぶか」。どちらも、ちょっとだけ腰が重い。用事がないと送れない空気があります。
        </p>
        <p>
          でも、仲のいい友だちに伝えたいことの大半は、用事ではありません。いま思い出した。授業がひま。へんな犬を見た。そういうものは文章にすると大げさになるし、送ったあとの既読の重さにも耐えられません。
        </p>
        <p>
          だから Wablo
          は、線だけにしました。指でぐにゃっと描いた線には、上手も下手もありません。うまく伝える義務から自由です。むしろ、へたな絵ほどよく届きます。
        </p>

        <h2>30秒しかありません</h2>
        <p>
          Wablo
          のキャンバスには30秒のタイマーがついています。時間切れになったら、その時点の絵がそのまま送信されます。描き直しはできません。
        </p>
        <p>
          ひどい仕様に聞こえるかもしれません。でもこれは罰ではなくて、考えすぎる前に送るための仕掛けです。30秒あれば犬は描けます。上手な犬は描けません。それでいいんです
          <sup id="ref-2">
            <a href="#fn-2">2</a>
          </sup>
          。
        </p>
        <p>ちなみに、まっしろのまま送ろうとすると、さすがに止められます。なにか一本は描いてください。</p>

        <h2>画面遷移を捨てて、机にしました</h2>
        <p>Wablo には画面遷移がありません。かわりに、大きな机がひとつあります。</p>
        <p>
          友だちの落書きは、机の上にカードの束として積まれています。一番上の一枚を眺めて、指で払うと次のカードが顔を出します。ページをめくるのではなく、紙を払う感じです。返信しようとすると、机の上のものがすっと画面の外へ片付いて、まっさらな紙が出てきます。送った落書きはふわっと持ち上がって飛んでいき、しばらくすると束の一番上にぽとっと落ちて、下のカードまで順番に揺れて収まります。
        </p>
        <p>
          つまりアプリの中で「別の画面に行く」ことは一度も起きません。カメラが机の上を移動しているだけです。SwiftUI と{' '}
          <a
            href="https://github.com/pointfreeco/swift-composable-architecture"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Composable Architecture
          </a>{' '}
          でカメラとカードの動きを全部自前で書くことになって、正直たいへんでしたが、この「ぜんぶ机の上で起きている」という感覚は、ふつうの画面遷移では出せなかったと思っています。
        </p>

        <h2>方眼紙、クレヨン、ラムネ色</h2>
        <p>見た目の合言葉は「方眼紙」「クレヨン」「ラムネ色」「ぷにっと押せる」「ぽとっと落ちる」の5つです。</p>
        <p>
          白いカードと淡い色で、主役はあくまで描かれた線。角は大きく丸く、線は太く、ボタンは押すと少し沈んで戻ります。ミニマルで洗練されたSNSではなく、机の上の紙と、子どものころのおもちゃ箱。ガラスや金属のようなプレミアムな質感は、意図的に避けています。
        </p>

        <h2>やらないことリスト</h2>
        <p>作る機能を決めるより、作らない機能を決めるほうに時間を使いました。</p>
        <p>
          フィードはありません。いいねの数も、ランキングも、公開プロフィールもありません。フォロワーという概念自体がないので、増やすものも減らすものもありません。リアクションは、カードをダブルタップして置ける小さなマークだけ。しかも5個で打ち止めです。
        </p>
        <p>
          SNSが作りたかったわけではないからです。作りたかったのは、放課後の教室で、となりの机に落書きした紙を投げる、あの感じです。
        </p>

        <h2>中身の話をすこしだけ</h2>
        <p>
          iOS は Swift 6 + SwiftUI + The Composable Architecture。サーバーは{' '}
          <a href="https://workers.cloudflare.com" target="_blank" rel="noopener noreferrer">
            Cloudflare Workers
          </a>{' '}
          +{' '}
          <a href="https://hono.dev" target="_blank" rel="noopener noreferrer">
            Hono
          </a>
          、データベースは Neon、画像は R2 という構成です。ロック画面には WidgetKit
          のウィジェットで、友だちの最新の落書きがそのまま出ます。アプリを開くより先に、犬（もしくはアシカ）が目に入る設計です。
        </p>
        <p>
          インフラが苦手な人間
          <sup id="ref-3">
            <a href="#fn-3">3</a>
          </sup>
          がひとりでサーバーまで面倒を見られているのは、ぜんぶエッジのプラットフォームがえらいおかげです。
        </p>

        <h2>さいごに</h2>
        <p>
          Wablo
          はまだ小さなアプリです。でも、友だちのロック画面にへんな犬が届いて、3秒だけ笑ってもらえたら、このアプリは仕事をしたことになります。会話がそこから始まってもいいし、始まらなくてもいい。
        </p>
        <p>
          伝えたいことが特にない日にこそ開いてもらえるアプリに、なれたらと思っています。結論は、みなさんの指で描いてください
          <sup id="ref-4">
            <a href="#fn-4">4</a>
          </sup>
          。
        </p>

        <section className="blog-footnotes" aria-label="脚注">
          <ol>
            <li id="fn-1">
              内部のリポジトリ名は、いまだに開発当初のコードネームのままです。名前を直す時間があったら機能を作りたかったので。{' '}
              <a href="#ref-1" aria-label="本文に戻る">
                ↩
              </a>
            </li>
            <li id="fn-2">
              30秒で描いた犬は、だいたいアシカになります。仕様です。{' '}
              <a href="#ref-2" aria-label="本文に戻る">
                ↩
              </a>
            </li>
            <li id="fn-3">
              くわしくは<Link href="/">デスクトップ</Link>のゴミ箱にある infra.zip をどうぞ。復元には失敗します。{' '}
              <a href="#ref-3" aria-label="本文に戻る">
                ↩
              </a>
            </li>
            <li id="fn-4">
              この記事の書き方（そっけないタイトル、短い段落、最後の脚注、そして最後のダジャレ）は{' '}
              <a href="https://benji.org" target="_blank" rel="noopener noreferrer">
                benji.org
              </a>{' '}
              をリスペクトしています。よい書き方は、ちゃんと真似していくスタイルです。{' '}
              <a href="#ref-4" aria-label="本文に戻る">
                ↩
              </a>
            </li>
          </ol>
        </section>

        <nav className="blog-backlinks" aria-label="ページ移動">
          <Link className="os-button" href="/blog">
            ◀ 記事いちらん
          </Link>
          <Link className="os-button" href="/">
            🍈 デスクトップに戻る
          </Link>
        </nav>
      </article>
    </BlogShell>
  )
}
