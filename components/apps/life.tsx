// くらし系のアプリ: 天気 / マップ / コンパス / ヘルスケア / フィットネス / ホーム /
// ウォレット / 翻訳 / 株価 / 探す。

import {
  AppDoc,
  Chips,
  Grid,
  List,
  ListRow,
  Meter,
  Note,
  opens,
  Quip,
  Rings,
  Row,
  Rows,
  Section,
  Segmented,
  SegPane,
  Sparkline,
  Tile,
  Toolbar,
} from './kit'

const FORECAST = [
  { day: '今日', icon: '☀️', high: 24, low: 21, note: '室内' },
  { day: '明日', icon: '☀️', high: 24, low: 21, note: '室内' },
  { day: '明後日', icon: '⛅️', high: 23, low: 21, note: '窓を開けた' },
  { day: '木', icon: '🌧', high: 22, low: 20, note: '洗濯物は室内' },
  { day: '金', icon: '☀️', high: 25, low: 21, note: '外に出るかも' },
]

export function WeatherBody() {
  return (
    <AppDoc>
      <div className="ak-weather-now tile-soda">
        <span className="ak-weather-icon" aria-hidden="true">
          ☀️
        </span>
        <span className="ak-weather-temp">24°</span>
        <span className="ak-weather-place">机の上</span>
        <span className="ak-weather-desc">晴れ ｜ 体感 24° ｜ 湿度 50%</span>
      </div>
      <List>
        {FORECAST.map((day) => (
          <ListRow
            key={day.day}
            icon={day.icon}
            color="soda"
            title={day.day}
            desc={day.note}
            meta={`${day.high}° / ${day.low}°`}
          />
        ))}
      </List>
      <Rows>
        <Row label="降水確率" value="0%" hint="室内なので" />
        <Row label="UV指数" value="0" hint="ディスプレイの明るさは別" />
        <Row label="風" value="エアコン 2" />
      </Rows>
      <Note>観測地点は机の上に固定されています。引っ越しの予定はありません。</Note>
    </AppDoc>
  )
}

const PLACES = [
  { icon: '🖥', label: 'デスク', sub: 'いまここ', app: 'profile' },
  { icon: '📁', label: 'Products', sub: '徒歩0分', app: 'products' },
  { icon: '📰', label: 'ブログ', sub: '徒歩0分', app: 'blog' },
  { icon: '🗑', label: 'ゴミ箱', sub: '見ないふり', app: 'trash' },
  { icon: '＞_', label: 'ターミナル', sub: '夜だけ営業', app: 'terminal' },
  { icon: '☕️', label: 'キッチン', sub: '1日8往復', app: 'health' },
]

export function MapsBody() {
  return (
    <AppDoc>
      <div className="ak-map" role="img" aria-label="tomokiOSの地図">
        <span className="ak-map-road ak-map-road--h" aria-hidden="true" />
        <span className="ak-map-road ak-map-road--v" aria-hidden="true" />
        <span className="ak-map-pin" aria-hidden="true">
          📍
        </span>
        <span className="ak-map-label">tomokiOS 市 机の上 1-6-40</span>
      </div>
      <Section title="よく行く場所">
        <Grid cols={3}>
          {PLACES.map((place) => (
            <Tile
              key={place.label}
              icon={place.icon}
              label={place.label}
              sub={place.sub}
              color="melon"
              {...opens(place.app)}
            />
          ))}
        </Grid>
      </Section>
      <Toolbar>
        <Quip label="経路を検索" quip="デスクからキッチンまで、徒歩12歩。渋滞はありません。" />
        <Quip label="現在地" quip="現在地は机の上です。精度は非常に高いです。" />
      </Toolbar>
      <Note>縮尺は 1:640 です。この地図には、まだ「外」が描かれていません。</Note>
    </AppDoc>
  )
}

export function CompassBody() {
  return (
    <AppDoc>
      <div className="ak-compass" data-compass>
        <div className="ak-compass-dial" data-compass-dial>
          <span className="ak-compass-n">N</span>
          <span className="ak-compass-e">E</span>
          <span className="ak-compass-s">S</span>
          <span className="ak-compass-w">W</span>
          <span className="ak-compass-needle" aria-hidden="true" />
        </div>
        <div className="ak-compass-read" data-compass-read aria-live="off">
          0° 北
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-compass-spin>
            方角を測る
          </button>
        </Toolbar>
      </div>
      <Rows>
        <Row label="標高" value="72cm" hint="机の高さ" />
        <Row label="傾き" value="0°" hint="ノートPCの角度は115°" />
      </Rows>
      <Note>本物の磁気センサーはありません。ボタンを押すと、それらしい方角を答えます。</Note>
    </AppDoc>
  )
}

export function HealthBody() {
  return (
    <AppDoc>
      <Section title="今日のまとめ">
        <List>
          <ListRow icon="👣" color="melon" title="歩数" desc="デスク ⇄ キッチン ×8" meta="412 歩" />
          <ListRow icon="🛌" color="lavender" title="睡眠" desc="就寝 26:40 ／ 起床 8:05" meta="5時間25分" />
          <ListRow icon="❤️" color="cherry" title="心拍数" desc="デプロイ直前に上昇" meta="72 → 118" />
          <ListRow icon="☕️" color="cream" title="カフェイン" desc="1日の上限を12時に到達" meta="3杯" />
        </List>
      </Section>
      <Section title="この1週間">
        <Sparkline points={[380, 520, 300, 640, 410, 250, 412]} color="melon" height={54} />
        <Meter label="今週の目標（3000歩）" value={2912} max={3000} color="melon" />
      </Section>
      <Toolbar>
        <button type="button" className="os-button" {...opens('fitness')}>
          フィットネスをひらく
        </button>
        <Quip label="データを書き出す" quip="書き出しました。中身は「今日もよく座りました」の1行です。" />
      </Toolbar>
      <Note>数字はぜんぶ架空です。ただし、640歩の日だけは実話です。</Note>
    </AppDoc>
  )
}

export function FitnessBody() {
  return (
    <AppDoc>
      <div className="ak-fitness">
        <Rings move={72} exercise={40} stand={92} />
        <div className="ak-fitness-legend">
          <span className="ak-fitness-item is-move">ムーブ 360 / 500 kcal</span>
          <span className="ak-fitness-item is-exercise">エクササイズ 12 / 30 分</span>
          <span className="ak-fitness-item is-stand">スタンド 11 / 12 時間</span>
        </div>
      </div>
      <Section title="ワークアウト">
        <List>
          <ListRow
            icon="🚶"
            color="melon"
            title="屋内ウォーキング"
            desc="キッチンまで"
            meta="12分"
            action
            data-quip="ペースは非常にゆっくりでした。考えごとをしていたためです。"
          />
          <ListRow
            icon="🧘"
            color="lavender"
            title="マインドフルネス"
            desc="ビルド待ち"
            meta="3分"
            action
            data-quip="呼吸に集中できませんでした。ログを見ていたためです。"
          />
          <ListRow
            icon="🏋️"
            color="cherry"
            title="筋力トレーニング"
            desc="予定"
            meta="0分"
            action
            data-quip="予定のままです。予定であるうちは失敗もしません。"
          />
        </List>
      </Section>
      <Note>スタンドリングだけよく閉じます。座りっぱなしに耐えかねて立つからです。</Note>
    </AppDoc>
  )
}

const DEVICES = [
  { icon: '💡', name: 'リビングの照明', state: '消灯', quip: '架空の部屋の照明がつきました。まぶしくありません。' },
  { icon: '🌡', name: 'エアコン', state: '26°', quip: '設定温度を1度下げました。体感は変わりません。' },
  { icon: '🔌', name: 'コンセント 1', state: 'ON', quip: '何がつながっているのか、本人も覚えていません。' },
  { icon: '📷', name: '玄関カメラ', state: 'オフライン', quip: '玄関そのものが実装されていません。' },
]

export function HomeBody() {
  return (
    <AppDoc>
      <Grid cols={2}>
        {DEVICES.map((device) => (
          <Tile
            key={device.name}
            icon={device.icon}
            label={device.name}
            sub={device.state}
            color="cream"
            data-quip={device.quip}
          />
        ))}
      </Grid>
      <Section title="シーン">
        <Chips>
          <button
            type="button"
            className="ak-chip ak-chip--button"
            data-quip="「おはよう」を実行しました。カーテンは手で開けてください。"
          >
            おはよう
          </button>
          <button
            type="button"
            className="ak-chip ak-chip--button"
            data-quip="「開発モード」を実行しました。照明が暗くなり、時間の感覚がなくなります。"
          >
            開発モード
          </button>
          <button
            type="button"
            className="ak-chip ak-chip--button"
            data-quip="「おやすみ」を実行しました。実行されたのは午前3時です。"
          >
            おやすみ
          </button>
        </Chips>
      </Section>
      <Note>この家には部屋が1つしかありません。机のある部屋です。</Note>
    </AppDoc>
  )
}

export function WalletBody() {
  return (
    <AppDoc>
      <div className="ak-cards">
        <div className="ak-card tile-lavender">
          <span className="ak-card-name">tomokiOS カード</span>
          <span className="ak-card-num">6400 0000 0000 0640</span>
          <span className="ak-card-foot">残高 640KB ｜ 有効期限 2006/06</span>
        </div>
        <div className="ak-card tile-cream">
          <span className="ak-card-name">メロンソーダ ポイント</span>
          <span className="ak-card-num">★ ★ ★ ☆ ☆</span>
          <span className="ak-card-foot">あと2杯で1杯無料</span>
        </div>
        <div className="ak-card tile-soda">
          <span className="ak-card-name">搭乗券（未使用）</span>
          <span className="ak-card-num">TOKYO → クパチーノ</span>
          <span className="ak-card-foot">出発時刻: いつか</span>
        </div>
      </div>
      <Toolbar>
        <Quip label="カードを追加" quip="カメラでカードを読み取ろうとしましたが、カメラがありませんでした。" />
        <Quip label="支払う" quip="ダブルクリックで支払い。……端末が見つかりませんでした。" />
      </Toolbar>
      <Note>3枚とも使えません。使えないカードほど、財布から出ていきません。</Note>
    </AppDoc>
  )
}

export function TranslateBody() {
  return (
    <AppDoc>
      <div className="ak-translate" data-translate>
        <div className="ak-translate-head">
          <span>日本語</span>
          <span aria-hidden="true">⇄</span>
          <span>エンジニア語</span>
        </div>
        <textarea
          className="ak-input ak-input--area"
          data-translate-input
          rows={2}
          placeholder="ちょっと確認します"
          aria-label="翻訳したい文"
        />
        <div className="ak-translate-out" data-translate-out aria-live="polite">
          文を入れて「翻訳」を押してください。
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-translate-run>
            翻訳
          </button>
          <button type="button" className="os-button" data-translate-swap>
            ⇄ 入れ替え
          </button>
        </Toolbar>
      </div>
      <Section title="よく使う言い回し">
        <List>
          <ListRow icon="💬" color="soda" title="ちょっと確認します" desc="→ 今から調べます（見当はついていません）" />
          <ListRow icon="💬" color="soda" title="一旦これで" desc="→ 直す気はあります（時期は未定）" />
          <ListRow icon="💬" color="soda" title="ベストエフォートで" desc="→ 約束はできません" />
        </List>
      </Section>
      <Note>オフライン翻訳が常時オンです。というより、通信していません。</Note>
    </AppDoc>
  )
}

const STOCKS = [
  {
    code: 'TOMO',
    name: 'tomokiOS 総研',
    price: '640.0',
    diff: '+6.40',
    up: true,
    points: [600, 612, 604, 625, 618, 636, 640],
  },
  {
    code: 'MELN',
    name: 'メロンソーダ飲料',
    price: '1,206.5',
    diff: '+12.06',
    up: true,
    points: [1100, 1150, 1120, 1180, 1170, 1195, 1206],
  },
  {
    code: 'INFR',
    name: 'インフラ層ホールディングス',
    price: '3.2',
    diff: '-99.90',
    up: false,
    points: [980, 720, 500, 260, 120, 40, 3],
  },
  {
    code: 'CFFE',
    name: '深夜カフェイン',
    price: '303.0',
    diff: '+3.03',
    up: true,
    points: [280, 291, 288, 296, 292, 300, 303],
  },
]

export function StocksBody() {
  return (
    <AppDoc>
      <div className="ak-stocklist" data-stocks>
        {STOCKS.map((stock) => (
          <div key={stock.code} className="ak-stock" data-stock={stock.code}>
            <span className="ak-stock-text">
              <strong>{stock.code}</strong>
              <span className="ak-list-desc">{stock.name}</span>
            </span>
            <Sparkline points={stock.points} color={stock.up ? 'melon' : 'cherry'} height={32} />
            <span className={`ak-stock-price${stock.up ? ' is-up' : ' is-down'}`}>
              <span data-stock-price>{stock.price}</span>
              <span className="ak-stock-diff">{stock.diff}%</span>
            </span>
          </div>
        ))}
      </div>
      <Rows>
        <Row label="市場" value="開いています" hint="架空の市場が" />
        <Row label="ポートフォリオ" value="INFR に全力" hint="含み損 -99.9%" />
      </Rows>
      <Note>INFR だけ現物で持っています。ゴミ箱の中にある 3.2GB と、株価の 3.2 は無関係です。</Note>
    </AppDoc>
  )
}

export function FindMyBody() {
  return (
    <AppDoc>
      <Segmented
        name="findmy"
        tabs={[
          { value: 'devices', label: 'デバイス' },
          { value: 'people', label: '人を探す' },
        ]}
      />
      <SegPane name="findmy" value="devices">
        <div className="ak-map ak-map--small" role="img" aria-label="デバイスの位置">
          <span className="ak-map-road ak-map-road--h" aria-hidden="true" />
          <span className="ak-map-road ak-map-road--v" aria-hidden="true" />
          <span className="ak-map-pin" aria-hidden="true">
            💻
          </span>
        </div>
        <List>
          <ListRow
            icon="💻"
            color="melon"
            title="tomokiBook"
            desc="机の上 ｜ たったいま"
            meta="オンライン"
            action
            data-quip="サウンドを再生しました。スピーカーがないので、光っただけです。"
          />
          <ListRow
            icon="📱"
            color="soda"
            title="tomokiPhone"
            desc="机の上（同じ場所）"
            meta="オンライン"
            action
            data-quip="サウンドを再生しました。となりで鳴っています。"
          />
          <ListRow
            icon="💾"
            color="lavender"
            title="フロッピー（640KB）"
            desc="最後の位置: 2006年"
            meta="オフライン"
            action
            data-quip="紛失モードにしました。見つかっても読める機械がありません。"
          />
        </List>
      </SegPane>
      <SegPane name="findmy" value="people">
        <List>
          <ListRow
            icon="🍈"
            color="cherry"
            title="tomokisun"
            desc="机の上 ｜ 移動していません"
            meta="共有中"
            action
            data-quip="到着通知を設定しました。すでに到着しています。"
          />
        </List>
        <Toolbar>
          <button type="button" className="os-button" {...opens('contacts')}>
            連絡先をひらく
          </button>
        </Toolbar>
      </SegPane>
      <Note>3台とも同じ場所にあります。持ち歩く習慣がないので、探す必要もありません。</Note>
    </AppDoc>
  )
}
