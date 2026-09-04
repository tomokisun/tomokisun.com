// OSの土台になるアプリ: プロフィール / Products / ソーシャル / ゴミ箱 / このOSについて /
// 設定 / ファイル / ブログ（いちらん）。
// どれもPCのウィンドウとSPのアプリ画面で同じ本体を使う。

import { blogArticles } from '@/components/blog/posts'
import { appsByCategory, CATEGORY_LABELS, spApps } from '@/data/apps'
import { blogPosts, formatPostDate } from '@/data/blog-posts'
import { products } from '@/data/products'
import { socialLinks } from '@/data/social-links'
import {
  type AppBodyProps,
  AppDoc,
  List,
  ListRow,
  Note,
  opens,
  Quip,
  Row,
  Rows,
  Section,
  Segmented,
  SegPane,
  Toolbar,
} from './kit'

export function ProfileBody() {
  return (
    <div className="txt-doc">
      <p>
        <span className="txt-key">なまえ</span>: tomokisun
      </p>
      <p>
        <span className="txt-key">しょくぎょう</span>: iOS出身のなんでも屋
      </p>
      <p className="txt-body">
        元々はiOSエンジニアですが、現在はモバイル、ウェブ、バックエンド、ブロックチェーンなど、様々な分野に携わっています。
        「1日1個アプリを作る」挑戦を90日間完遂しました。
      </p>
      <p>
        <span className="txt-key">いま</span>: ONE, Inc.（友人と共同創業）
      </p>
      <p className="txt-body">10代向けのソーシャルモバイルアプリを開発中です。</p>
      <p>
        <span className="txt-key">まえ</span>: CAMPFIRE, Inc.
      </p>
      <p className="txt-body">
        日本最大級のクラウドファンディングサイトで、モバイルアプリのローンチを担当。立ち上げ期は3人のエンジニアで、その後はiOS・Android・APIサーバーをほぼひとりで開発していました。
      </p>
      <p>
        <span className="txt-key">にがて</span>: インフラ層（笑）→{' '}
        <button type="button" className="blog-inline-open" {...opens('trash')}>
          ゴミ箱に捨てました
        </button>
      </p>
    </div>
  )
}

const PRODUCT_TILES = ['cherry', 'melon', 'soda', 'cream', 'lavender', 'cherry', 'melon'] as const

export function ProductsBody({ platform }: AppBodyProps) {
  if (platform === 'sp') {
    return (
      <div className="sp-products-list">
        {products.map((product) => (
          <a key={product.id} className="sp-product-item" href={product.url} target="_blank" rel="noopener noreferrer">
            <span className={`sp-product-icon tile-${product.color}`}>{product.acquiredBy ? '🔒' : product.icon}</span>
            <div className="sp-product-info">
              <div className="sp-product-name">
                {product.title}
                {product.acquiredBy && <span className="os-badge os-badge--acq">買収済</span>}
              </div>
              <div className="sp-product-desc">{product.description}</div>
            </div>
            <span className="sp-product-arrow">↗</span>
          </a>
        ))}
      </div>
    )
  }
  return (
    <div className="folder-grid">
      {products.map((product, index) => (
        <a
          key={product.id}
          className="os-icon os-icon--folder"
          href={`#win-p-${product.id}`}
          data-open={`p-${product.id}`}
        >
          <span className={`os-icon-tile tile-${PRODUCT_TILES[index % PRODUCT_TILES.length]}`} aria-hidden="true">
            {product.acquiredBy ? '🔒' : product.icon}
          </span>
          <span className="os-icon-label">
            {product.title}.app
            {product.isNew && <span className="os-badge os-badge--new">NEW</span>}
            {product.acquiredBy && <span className="os-badge os-badge--acq">買収済</span>}
          </span>
        </a>
      ))}
    </div>
  )
}

export function SocialBody() {
  return (
    <ul className="net-list">
      {socialLinks.map((link) => (
        <li key={link.platform} className="net-row">
          <span className="net-dot net-dot--on" aria-hidden="true" />
          <span className="net-platform">{link.platform}</span>
          <span className="net-value">
            {link.url ? (
              <a
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                {link.display}
              </a>
            ) : (
              link.display
            )}
          </span>
        </li>
      ))}
      <li className="net-row net-row--error">
        <span className="net-dot net-dot--off" aria-hidden="true" />
        <span className="net-platform">infra-layer.sys</span>
        <span className="net-value">接続に失敗しました（再試行しない）</span>
      </li>
    </ul>
  )
}

export function TrashBody() {
  return (
    <div className="trash-body">
      <div className="trash-item">
        <span className="os-icon-tile tile-dark" aria-hidden="true">
          🗜
        </span>
        <div className="trash-item-meta">
          <div className="trash-item-name">infra.zip（3.2GB）</div>
          <div className="trash-item-desc">インフラ層一式（Kubernetes、Terraform、他）— 削除日: だいぶ前</div>
        </div>
      </div>
      <div className="trash-actions">
        <button type="button" className="os-button" data-trash-restore>
          復元
        </button>
        <button type="button" className="os-button os-button--danger" data-trash-empty>
          ゴミ箱を空にする
        </button>
      </div>
      <p className="trash-message" data-trash-message aria-live="polite" />
    </div>
  )
}

export function AboutBody() {
  return (
    <div className="about-body">
      <div className="about-logo" aria-hidden="true">
        🍈
      </div>
      <div className="about-name">tomokiOS 26</div>
      <div className="about-tagline">"Cream Soda" — 素通り禁止オペレーティングシステム</div>
      <dl className="about-specs">
        <div>
          <dt>プロセッサ</dt>
          <dd>なつかしさ 100%</dd>
        </div>
        <div>
          <dt>メモリ</dt>
          <dd>640KB（じゅうぶんなはず）</dd>
        </div>
        <div>
          <dt>アプリ</dt>
          <dd>{spApps.length + 1} 個プリインストール済み</dd>
        </div>
        <div>
          <dt>稼働開始</dt>
          <dd>SINCE 2006</dd>
        </div>
        <div>
          <dt>カーネル</dt>
          <dd>Next.js + OpenNext on Cloudflare Workers</dd>
        </div>
      </dl>
      <p className="about-footer">
        <a href="https://github.com/tomokisun/tomokisun.com" target="_blank" rel="noopener noreferrer">
          ソースコード
        </a>{' '}
        ｜ © 2006–2026 tomokisun. 権利はだいたい本人にあります。
      </p>
    </div>
  )
}

export function SettingsBody() {
  return (
    <AppDoc>
      <Segmented
        name="settings"
        tabs={[
          { value: 'general', label: '一般' },
          { value: 'display', label: '画面' },
          { value: 'apps', label: 'アプリ' },
          { value: 'about', label: '情報' },
        ]}
      />
      <SegPane name="settings" value="general">
        <Section title="この端末">
          <Rows>
            <Row
              label="モデル名"
              value={
                <>
                  <span className="pc-only">tomokiBook</span>
                  <span className="sp-only">tomokiPhone</span>
                </>
              }
            />
            <Row label="OS" value='tomokiOS 26 "Cream Soda"' />
            <Row label="ビルド" value="2006A" />
            <Row label="ストレージ" value="639KB / 640KB 使用" hint="のこり1KB" />
          </Rows>
        </Section>
        <Section title="ソフトウェア・アップデート">
          <Rows>
            <Row label="状態" value="最新です" hint="というより、これが全部です" />
          </Rows>
          <Toolbar>
            <Quip label="今すぐ確認" quip="確認しました。やっぱり最新でした。" />
          </Toolbar>
        </Section>
        <Section title="プライバシーとセキュリティ">
          <Rows>
            <Row label="位置情報" value="机の上（固定）" />
            <Row label="解析データの共有" value="ON" hint="送り先は本人の好奇心" />
            <Row label="広告" value="ありません" />
          </Rows>
        </Section>
      </SegPane>
      <SegPane name="settings" value="display">
        <Section title="壁紙">
          <Rows>
            <Row label="現在の壁紙" value={<span data-settings-wallpaper>ソーダ</span>} />
          </Rows>
          <Toolbar>
            <button type="button" className="os-button" data-settings-wallpaper-next>
              つぎの壁紙にする
            </button>
          </Toolbar>
          <Note>
            <span className="pc-only">デスクトップの右クリックからも変えられます。</span>
            <span className="sp-only">コントロールセンターからも変えられます。</span>
          </Note>
        </Section>
        <Section title="ホーム画面">
          <div className="sp-only">
            <Rows>
              <Row label="Appライブラリ" value="いちばん右のページ" />
            </Rows>
            <Toolbar>
              <button type="button" className="os-button" data-sp-edit-home>
                ホーム画面を編集
              </button>
            </Toolbar>
            <Note>アイコンの長押しでも編集できます。削除は、だいたい断られます。</Note>
          </div>
          <div className="pc-only">
            <Rows>
              <Row label="Launchpad" value="Dockの ⌘ から" />
              <Row label="Spotlight" value="⌘K または ⌘Space" />
            </Rows>
            <Note>デスクトップに出すアイコンは数個だけにしてあります。残りはDockとLaunchpadから。</Note>
          </div>
        </Section>
        <Section title="明るさとサウンド">
          <Rows>
            <Row label="サウンド" value="OFF" hint="静かなOS" />
            <Row label="Night Shift" value="日没から日の出まで（体感）" />
            <Row label="True Tone" value="ON（クリームソーダ寄り）" />
          </Rows>
        </Section>
      </SegPane>
      <SegPane name="settings" value="apps">
        <Section title="アプリの設定">
          <List>
            {appsByCategory(spApps).map(([category, group]) => (
              <ListRow
                key={category}
                icon={group[0]?.icon ?? '📦'}
                color={group[0]?.color}
                title={CATEGORY_LABELS[category]}
                desc={group.map((app) => app.name).join('・')}
                meta={`${group.length}`}
                action
                data-quip={`${CATEGORY_LABELS[category]}の詳細設定は、それぞれのアプリの中にあります。`}
              />
            ))}
          </List>
          <Note>アプリごとの設定は、そのアプリを開けばだいたい正面にあります。階層はあさいほうが好みです。</Note>
        </Section>
        <Section title="通知">
          <Rows>
            <Row label="通知スタイル" value="バナー" />
            <Row label="時間指定要約" value="OFF" hint="要約するほど来ません" />
          </Rows>
        </Section>
      </SegPane>
      <SegPane name="settings" value="about">
        <Section title="法定情報と規制">
          <Rows>
            <Row label="設計と開発" value="tomokisun" />
            <Row label="製造" value="夜" />
            <Row label="保証" value="ありません（善意はあります）" />
          </Rows>
          <Toolbar>
            <button type="button" className="os-button" {...opens('about')}>
              このOSについて
            </button>
            <Quip
              label="すべての設定をリセット"
              quip="リセットしました。何も変わっていないように見えるのは、元から何も設定していないためです。"
              danger
            />
          </Toolbar>
        </Section>
      </SegPane>
    </AppDoc>
  )
}

const FILES = [
  { icon: '📝', color: 'cherry' as const, name: 'プロフィール.txt', size: '2 KB', app: 'profile' },
  { icon: '📁', color: 'melon' as const, name: 'Products', size: '7 項目', app: 'products' },
  { icon: '📰', color: 'cherry' as const, name: 'blog', size: `${blogPosts.length} 項目`, app: 'blog' },
  { icon: '📒', color: 'cream' as const, name: 'メモ.txt', size: '0 KB', app: 'memo' },
  { icon: '🖼', color: 'cream' as const, name: 'ogp.png', size: '48 KB', app: 'preview' },
  { icon: '🗜', color: 'lavender' as const, name: 'infra.zip', size: '3.2 GB', app: 'trash' },
]

export function FinderBody() {
  return (
    <AppDoc>
      <div className="ak-path">/Users/tomokisun</div>
      <List>
        {FILES.map((file) => (
          <ListRow
            key={file.name}
            icon={file.icon}
            color={file.color}
            title={file.name}
            desc={file.size}
            arrow
            action
            {...opens(file.app)}
          />
        ))}
      </List>
      <Note>
        infra.zip だけ、いつまでもゴミ箱から消えません。3.2GB あるので、のこり1KBの計算はどこかで間違っています。
      </Note>
    </AppDoc>
  )
}

/** ブログのいちらん。PCは記事ウィンドウを開き、SPはアプリ内でペインを押し出す */
export function BlogListBody({ platform }: AppBodyProps) {
  if (platform === 'sp') {
    return (
      <>
        <div className="sp-products-list">
          {blogPosts.map((post) => (
            <button key={post.slug} type="button" className="sp-product-item" data-sp-blog-open={post.slug}>
              <span className="sp-product-icon tile-soda">{post.icon}</span>
              <div className="sp-product-info">
                <div className="sp-product-name">{post.title}</div>
                <div className="sp-product-desc">
                  {formatPostDate(post.date)} ｜ {post.description}
                </div>
              </div>
              <span className="sp-product-arrow">→</span>
            </button>
          ))}
        </div>
        <p className="blog-window-note">らくがきではなく、文章を書く日もあります。</p>
      </>
    )
  }
  return (
    <>
      <ul className="blog-list">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <div>
              {/* 記事はOSを出ずに別ウィンドウで開く（OSの外にページは無い） */}
              <a href={`#win-blog-${post.slug}`} data-open={`blog-${post.slug}`}>
                {post.title}
              </a>
              <div className="blog-list-desc">{post.description}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="blog-window-note">らくがきではなく、文章を書く日もあります。</p>
    </>
  )
}

/** SPのブログアプリ本体（いちらん＋きじペイン）。lib/sp/blog.ts が push/pop する */
export function BlogAppBody() {
  return (
    <div className="sp-blog" data-sp-blog>
      <div className="sp-blog-pane sp-blog-list" data-sp-blog-pane="list">
        <BlogListBody platform="sp" />
      </div>
      {blogPosts.map((post) => {
        const Article = blogArticles[post.slug]
        if (!Article) return null
        return (
          <article
            key={post.slug}
            className="sp-blog-pane sp-blog-post"
            data-sp-blog-pane={post.slug}
            aria-label={`${post.slug}.md`}
            hidden
          >
            <header className="sp-blog-nav">
              <button type="button" className="sp-app-back" data-sp-blog-back>
                ‹ いちらん
              </button>
              <span className="sp-blog-nav-title">{post.slug}.md</span>
            </header>
            <div className="sp-blog-post-body blog-doc">
              <Article variant="sp" />
              <p className="blog-window-note">
                ともだちに送るときは tomokisun.com/blog/{post.slug} をどうぞ。ひらくと、この画面がそのまま開きます。
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
