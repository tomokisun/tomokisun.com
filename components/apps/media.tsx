// メディア系のアプリ: ブラウザ / ミュージック / クラシック / ポッドキャスト / テレビ /
// ブック / 写真 / カメラ / ボイスメモ / これなに？ / アプリストア / iTunes Store / tomokiストア。

import { apps, spApps } from '@/data/apps'
import { products } from '@/data/products'
import {
  AppDoc,
  AppHero,
  Chip,
  Chips,
  Grid,
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
  Tile,
  Toolbar,
} from './kit'

const BOOKMARKS = [
  { icon: '📝', label: 'tomokisun.com', desc: 'いま見ているところ', app: 'profile' },
  { icon: '📰', label: 'tomokisun.com/blog', desc: '記事いちらん', app: 'blog' },
  { icon: '📁', label: 'products/', desc: '作ったもの', app: 'products' },
  { icon: '🌐', label: 'ソーシャル', desc: '外に出るときの入口', app: 'social' },
]

const EXTERNAL = [
  { icon: '🐙', label: 'github.com/tomokisun', url: 'https://github.com/tomokisun' },
  { icon: '🧢', label: 'suzuri.jp/tomokisun', url: 'https://suzuri.jp/tomokisun' },
  { icon: '💚', label: 'newmatch.app', url: 'https://newmatch.app' },
]

export function SafariBody() {
  return (
    <AppDoc>
      <div className="ak-urlbar">
        <span className="ak-urlbar-lock" aria-hidden="true">
          🔒
        </span>
        <span className="ak-urlbar-text">tomokisun.com</span>
        <span className="ak-urlbar-reload" aria-hidden="true">
          ↻
        </span>
      </div>
      <Section title="お気に入り（このOSの中）">
        <Grid cols={4}>
          {BOOKMARKS.map((mark) => (
            <Tile
              key={mark.app}
              icon={mark.icon}
              label={mark.label}
              sub={mark.desc}
              color="soda"
              {...opens(mark.app)}
            />
          ))}
        </Grid>
      </Section>
      <Section title="よく行くところ（別のマシン）">
        <List>
          {EXTERNAL.map((site) => (
            <ListRow key={site.url} icon={site.icon} color="cream" title={site.label} desc={site.url} meta="↗" />
          ))}
        </List>
        <div className="ak-linkrow">
          {EXTERNAL.map((site) => (
            <a key={site.url} className="os-button" href={site.url} target="_blank" rel="noopener noreferrer">
              {site.label} ↗
            </a>
          ))}
        </div>
      </Section>
      <Note>アドレスバーは飾りです。行き先はこのOSの中か、はっきり「外のマシン」だけ。迷子にはなりません。</Note>
    </AppDoc>
  )
}

const TRACKS = [
  { title: 'ビルドが通った', artist: 'tomokisun', length: '3:12' },
  { title: '640KBのワルツ', artist: 'Cream Soda Quartet', length: '2:06' },
  { title: 'インフラ層（未完）', artist: 'tomokisun', length: '0:19' },
  { title: '深夜のホットリロード', artist: 'Turbopack', length: '4:04' },
  { title: 'そっちは天井です', artist: 'tomokiOS', length: '1:00' },
]

export function MusicBody() {
  return (
    <AppDoc>
      <div className="ak-player" data-music>
        <div className="ak-player-art tile-cherry" aria-hidden="true">
          🍈
        </div>
        <div className="ak-player-meta">
          <strong className="ak-player-title" data-music-title>
            ビルドが通った
          </strong>
          <span className="ak-player-artist" data-music-artist>
            tomokisun
          </span>
        </div>
        <div className="ak-player-bar">
          <span className="ak-player-progress" data-music-progress />
        </div>
        <div className="ak-player-times">
          <span data-music-elapsed>0:00</span>
          <span data-music-length>3:12</span>
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-music-prev aria-label="まえの曲">
            ⏮
          </button>
          <button type="button" className="os-button" data-music-toggle>
            ▶ 再生
          </button>
          <button type="button" className="os-button" data-music-next aria-label="つぎの曲">
            ⏭
          </button>
        </Toolbar>
      </div>
      <Section title="プレイリスト「作業用」">
        <ol className="ak-tracklist" data-music-list>
          {TRACKS.map((track, i) => (
            <li key={track.title}>
              <button type="button" className="ak-track" data-music-track={i}>
                <span className="ak-track-no">{i + 1}</span>
                <span className="ak-track-text">
                  <span className="ak-track-title">{track.title}</span>
                  <span className="ak-track-artist">{track.artist}</span>
                </span>
                <span className="ak-track-length">{track.length}</span>
              </button>
            </li>
          ))}
        </ol>
      </Section>
      <Note>音は鳴りません。このMacにスピーカーはありません（ターミナルの say でも同じことを言われます）。</Note>
    </AppDoc>
  )
}

const CLASSICAL = [
  { composer: 'J.S. バッハ', work: '無伴奏ビルドのための組曲', note: '朝いちばんに聴く' },
  { composer: 'ドビュッシー', work: '月の光（デプロイ中）', note: '待ち時間に' },
  { composer: 'サティ', work: 'ジムノペディ第1番', note: '設計が決まらない日' },
  { composer: 'ラヴェル', work: 'ボレロ（リトライ付き）', note: '同じ処理が何度も来る' },
]

export function ClassicalBody() {
  return (
    <AppDoc>
      <Chips>
        <Chip tone="lavender">作曲家</Chip>
        <Chip tone="cream">作品</Chip>
        <Chip tone="soda">指揮者</Chip>
      </Chips>
      <List>
        {CLASSICAL.map((piece) => (
          <ListRow
            key={piece.work}
            icon="🎻"
            color="lavender"
            title={piece.work}
            desc={piece.composer}
            meta="ハイレゾ"
            action
            data-quip={`${piece.note}のための1曲です。音は鳴りません。`}
          />
        ))}
      </List>
      <Rows>
        <Row label="音質" value="ロスレス" hint="無音もロスレスです" />
        <Row label="録音" value="スタジオ（本人の部屋）" />
      </Rows>
      <Note>クラシックだけ別アプリになっている理由は、本家にならいました。深い意味はありません。</Note>
    </AppDoc>
  )
}

export function PodcastsBody() {
  return (
    <AppDoc>
      <AppHero icon="🎙" title="640KB ラジオ" sub="tomokisun ／ 週刊（第1回で停止）" color="lavender" />
      <List>
        <ListRow
          icon="▶"
          color="lavender"
          title="#1 インフラが苦手なままアプリを作る"
          desc="42分 ｜ 2026/03/03"
          meta="未再生"
          action
          data-quip="42分あるうち、38分は雑談です。要点は「なんとかなる」でした。"
        />
        <ListRow
          icon="⏳"
          color="cream"
          title="#2 （収録予定）"
          desc="台本: 0行"
          meta="未定"
          action
          data-quip="台本ができ次第、収録します。台本を書く予定は未定です。"
        />
      </List>
      <Toolbar>
        <Quip label="フォロー" quip="フォローしました。更新されたらお知らせします（更新されません）。" />
      </Toolbar>
      <Note>再生速度は 1.0× と 1.5× があります。どちらでも第2回は来ません。</Note>
    </AppDoc>
  )
}

const SHOWS = [
  {
    title: 'ある夜のリファクタリング',
    genre: 'ドキュメンタリー',
    len: '全1話',
    quip: '主人公が変数名を3時間考える回です。',
  },
  {
    title: '90日間、毎日アプリを作る',
    genre: 'ドキュメンタリー',
    len: '全90話',
    quip: '実話です。最後まで作りきりました。',
  },
  { title: 'インフラ層の逆襲', genre: 'ホラー', len: '未公開', quip: '本人が怖がって完成しませんでした。' },
]

export function TvBody() {
  return (
    <AppDoc>
      <div className="ak-billboard tile-cherry">
        <span className="ak-billboard-emoji" aria-hidden="true">
          📺
        </span>
        <span className="ak-billboard-text">
          <strong>今夜の1本</strong>
          <span>ある夜のリファクタリング（全1話）</span>
        </span>
      </div>
      <List>
        {SHOWS.map((show) => (
          <ListRow
            key={show.title}
            icon="🎬"
            color="cherry"
            title={show.title}
            desc={`${show.genre} ｜ ${show.len}`}
            action
            data-quip={show.quip}
          />
        ))}
      </List>
      <Note>字幕は日本語のみです。制作も視聴も、いまのところ本人ひとりです。</Note>
    </AppDoc>
  )
}

const BOOKS = [
  { title: 'Kubernetes 完全ガイド', progress: '3%', quip: '3%のところに付箋が貼られたまま4年経ちました。' },
  { title: 'Terraform 入門', progress: '1ページ', quip: 'ゴミ箱の infra.zip にも同じPDFが入っています。' },
  { title: 'リーダブルコード', progress: '100%', quip: '読み終えた本です。ちゃんと役に立ちました。' },
  { title: 'ドメイン駆動設計', progress: '積読', quip: '厚みが自信になるタイプの本です。' },
]

export function BooksBody() {
  return (
    <AppDoc>
      <Section title="読書中">
        <List>
          {BOOKS.map((book) => (
            <ListRow
              key={book.title}
              icon="📕"
              color="cream"
              title={book.title}
              desc={`進捗 ${book.progress}`}
              action
              data-quip={book.quip}
            />
          ))}
        </List>
      </Section>
      <Rows>
        <Row label="今年読んだ本" value="1冊" hint="去年は0冊なので進歩です" />
        <Row label="積読" value="3冊" hint="同期は正常です" />
      </Rows>
      <Note>読書目標は設定できます。設定するだけで満足するので、毎年設定しています。</Note>
    </AppDoc>
  )
}

const PHOTOS = [
  { emoji: '🍈', caption: 'メロンソーダ（OSの由来）' },
  { emoji: '🖥', caption: '机の上' },
  { emoji: '🌙', caption: '深夜3時のビルド' },
  { emoji: '☕️', caption: '3杯目' },
  { emoji: '🐙', caption: 'コミットグラフ' },
  { emoji: '🗜', caption: 'infra.zip（証拠写真）' },
  { emoji: '🧢', caption: 'グッズの試作' },
  { emoji: '📱', caption: '審査に出す直前' },
]

export function PhotosBody() {
  return (
    <AppDoc>
      <div className="ak-photos" data-photos>
        <Grid cols={4}>
          {PHOTOS.map((photo) => (
            <button
              key={photo.emoji}
              type="button"
              className="ak-photo"
              data-photo={photo.emoji}
              data-photo-caption={photo.caption}
              aria-label={photo.caption}
            >
              <span aria-hidden="true">{photo.emoji}</span>
            </button>
          ))}
        </Grid>
        <div className="ak-photo-view" data-photo-view hidden>
          <span className="ak-photo-big" data-photo-big aria-hidden="true" />
          <span className="ak-photo-caption" data-photo-caption-out />
          <button type="button" className="os-button" data-photo-close>
            とじる
          </button>
        </div>
      </div>
      <Toolbar>
        <button type="button" className="os-button" {...opens('camera')}>
          カメラで撮る
        </button>
        <Quip label="メモリー を作成" quip="「2026年のふりかえり」を作りました。ぜんぶ机の写真でした。" />
      </Toolbar>
      <Note>ライブラリの容量は1KB未満です。ぜんぶ絵文字なので、バックアップも一瞬で終わります。</Note>
    </AppDoc>
  )
}

export function CameraBody() {
  return (
    <AppDoc>
      <div className="ak-camera" data-camera>
        <div className="ak-viewfinder" data-camera-view>
          <span className="ak-viewfinder-subject" data-camera-subject aria-hidden="true">
            🍈
          </span>
          <span className="ak-viewfinder-grid" aria-hidden="true" />
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-camera-flip>
            切り替え
          </button>
          <button type="button" className="ak-shutter" data-camera-shoot aria-label="撮影">
            <span aria-hidden="true" />
          </button>
          <button type="button" className="os-button" {...opens('photos')}>
            写真へ
          </button>
        </Toolbar>
        <p className="ak-note" data-camera-note aria-live="polite">
          レンズはありません。写るのは、いま目の前にある絵文字だけです。
        </p>
      </div>
    </AppDoc>
  )
}

export function VoiceMemosBody() {
  return (
    <AppDoc>
      <div className="ak-recorder" data-recorder>
        <div className="ak-wave" data-recorder-wave aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 波形の棒は位置そのもの
            <span key={i} />
          ))}
        </div>
        <div className="ak-stopwatch-display" data-recorder-time aria-live="off">
          00:00
        </div>
        <Toolbar>
          <button type="button" className="ak-record" data-recorder-toggle aria-label="録音">
            <span aria-hidden="true" />
          </button>
        </Toolbar>
      </div>
      <Section title="録音">
        <List>
          <ListRow
            icon="🎤"
            color="cherry"
            title="新規録音 1"
            desc="2026/09/01 ｜ 00:07"
            meta="再生不可"
            action
            data-quip="「あ、これ後で使えるかも」だけが録音されています。"
          />
          <ListRow
            icon="🎤"
            color="cherry"
            title="新規録音 2"
            desc="2026/09/01 ｜ 01:42"
            meta="再生不可"
            action
            data-quip="ほぼ生活音です。冷蔵庫の音が主役になっています。"
          />
        </List>
      </Section>
      <Note>録音はできますが、再生はできません。世に出ない声のほうが多い、という設計です。</Note>
    </AppDoc>
  )
}

export function ShazamBody() {
  return (
    <AppDoc>
      <div className="ak-shazam" data-shazam>
        <button type="button" className="ak-shazam-button" data-shazam-listen>
          <span className="ak-shazam-ring" aria-hidden="true" />
          <span className="ak-shazam-label" data-shazam-label>
            きく
          </span>
        </button>
        <p className="ak-note" data-shazam-result aria-live="polite">
          ボタンを押すと、いま流れている曲をあてます。
        </p>
      </div>
      <Section title="これまでの判定">
        <List>
          <ListRow icon="🎧" color="soda" title="ビルドが通った" desc="tomokisun ｜ 判定: たぶん" meta="★" />
          <ListRow icon="🎧" color="soda" title="冷蔵庫（変ロ長調）" desc="生活音 ｜ 判定: 自信あり" meta="★" />
        </List>
      </Section>
      <Note>正解率は雰囲気です。だいたい「作業用BGM」と答えます。</Note>
    </AppDoc>
  )
}

export function AppStoreBody() {
  const featured = apps.filter((app) => ['freeform', 'clock', 'holdem', 'shortcuts'].includes(app.id))
  return (
    <AppDoc>
      <Segmented
        name="appstore"
        tabs={[
          { value: 'today', label: 'Today' },
          { value: 'all', label: 'すべて' },
          { value: 'updates', label: 'アップデート' },
        ]}
      />
      <SegPane name="appstore" value="today">
        <div className="ak-billboard tile-soda">
          <span className="ak-billboard-emoji" aria-hidden="true">
            🍈
          </span>
          <span className="ak-billboard-text">
            <strong>本日のおすすめ</strong>
            <span>プリインストール {spApps.length + 1} 個。追加購入は不要です。</span>
          </span>
        </div>
        <List>
          {featured.map((app) => (
            <ListRow
              key={app.id}
              icon={app.icon}
              color={app.color}
              title={app.name}
              desc={app.subtitle}
              meta="ひらく"
              action
              {...opens(app.id)}
            />
          ))}
        </List>
      </SegPane>
      <SegPane name="appstore" value="all">
        <List>
          {apps.map((app) => (
            <ListRow
              key={app.id}
              icon={app.icon}
              color={app.color}
              title={app.name}
              desc={app.subtitle}
              meta="入手済み"
              action
              {...opens(app.id)}
            />
          ))}
        </List>
      </SegPane>
      <SegPane name="appstore" value="updates">
        <Rows>
          <Row label="アップデート" value="0 件" hint="全部さいしんです" />
          <Row label="自動更新" value="ON" hint="更新されたことはありません" />
        </Rows>
        <Toolbar>
          <Quip label="すべてアップデート" quip="アップデートするものがありませんでした。健康な状態です。" />
        </Toolbar>
      </SegPane>
      <Note>課金要素はありません。支払い方法を登録しようとすると、ウォレットが 640KB を差し出してきます。</Note>
    </AppDoc>
  )
}

export function ITunesBody() {
  return (
    <AppDoc>
      <AppHero icon="🎼" title="iTunes Store" sub="まだ営業しています" color="cherry" />
      <List>
        <ListRow
          icon="💿"
          color="cherry"
          title="アルバム「640KB」"
          desc="tomokisun ｜ 全5曲"
          meta="¥0"
          action
          data-quip="購入しました。ダウンロード先が見つかりません。"
        />
        <ListRow
          icon="🎬"
          color="lavender"
          title="映画「ある夜のリファクタリング」"
          desc="レンタル 48時間"
          meta="¥0"
          action
          data-quip="レンタルしました。視聴期限は48時間です。作品は1分です。"
        />
        <ListRow
          icon="🔔"
          color="cream"
          title="着信音「起動音」"
          desc="0:03"
          meta="¥0"
          action
          data-quip="着信音に設定しました。電話が鳴らないので、まだ聞けていません。"
        />
      </List>
      <Rows>
        <Row label="購入履歴" value="0 件" />
        <Row label="ギフトカード残高" value="0円" hint="チャージ方法は未実装です" />
      </Rows>
      <Note>このアプリだけ、なぜかいつまでも消えずに残っています。本家もそうでした。</Note>
    </AppDoc>
  )
}

export function StoreBody() {
  return (
    <AppDoc>
      <AppHero icon="🧢" title="tomokiストア" sub="実在するグッズ（SUZURI）" color="melon" />
      <Grid cols={3}>
        <Tile icon="🧢" label="キャップ" sub="かぶれます" color="melon" data-quip="実在します。サイズはひとつです。" />
        <Tile
          icon="👕"
          label="Tシャツ"
          sub="着られます"
          color="soda"
          data-quip="実在します。洗っても 640KB のままです。"
        />
        <Tile
          icon="🥤"
          label="ステッカー"
          sub="貼れます"
          color="cherry"
          data-quip="MacBookの天板にちょうどいい大きさです。"
        />
      </Grid>
      <div className="ak-linkrow">
        <a className="os-button" href="https://suzuri.jp/tomokisun" target="_blank" rel="noopener noreferrer">
          SUZURI でひらく ↗
        </a>
      </div>
      <Section title="人気の Products">
        <List>
          {products.slice(0, 3).map((product) => (
            <ListRow
              key={product.id}
              icon={product.icon}
              color="melon"
              title={product.title}
              desc={product.description}
              meta="無料"
            />
          ))}
        </List>
      </Section>
      <Note>ここだけは本物の買い物ができます。OSの外＝別のマシンなので、新しいタブで開きます。</Note>
    </AppDoc>
  )
}
