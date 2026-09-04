// ユーティリティ小物。macOSの「ユーティリティ」フォルダに入っている、
// 一度も開いたことがないのに消せないアプリたち。

import {
  AppDoc,
  AppHero,
  Console,
  Grid,
  List,
  ListRow,
  Meter,
  Note,
  opens,
  Quip,
  Row,
  Rows,
  Section,
  Sparkline,
  Tile,
  Toolbar,
} from './kit'

export function MagnifierBody() {
  return (
    <AppDoc>
      <div className="ak-magnifier" data-magnifier>
        <p className="ak-magnifier-sample" data-magnifier-sample>
          このOSの利用規約は1行です。<strong>素通り禁止。</strong>
          小さく書いてある大事なことほど、あとで効いてきます。
        </p>
        <label className="ak-slider-row">
          <span>倍率</span>
          <input
            className="ak-slider"
            type="range"
            min="100"
            max="400"
            defaultValue="100"
            step="10"
            data-magnifier-zoom
            aria-label="倍率"
          />
          <span data-magnifier-value>1.0×</span>
        </label>
      </div>
      <Rows>
        <Row label="コントラスト" value="標準" />
        <Row label="読み上げ" value="OFF" hint="スピーカーがないため" />
      </Rows>
      <Note>倍率を上げるほど、読まなくてよかった文章がよく見えるようになります。</Note>
    </AppDoc>
  )
}

const WORDS = [
  { word: '一旦', reading: 'いったん', means: '直す気はある。時期は未定。' },
  { word: 'ベストエフォート', reading: '—', means: '約束はできないが、がんばる。' },
  { word: '技術的負債', reading: 'ぎじゅつてきふさい', means: '未来の自分への手紙。返事は来ない。' },
  { word: 'インフラ', reading: '—', means: '本人が苦手とする層。ゴミ箱に3.2GBある。' },
  { word: 'MVP', reading: '—', means: '出したあとに増える機能のこと。' },
  { word: 'あとでやる', reading: '—', means: '予定ではない。カレンダーにも載らない。' },
  { word: '640KB', reading: 'ろっぴゃくよんじゅうキロバイト', means: 'じゅうぶんな量。' },
  { word: 'リファクタリング', reading: '—', means: '動いているものを触って、また動かすこと。' },
]

export function DictionaryBody() {
  return (
    <AppDoc>
      <div className="ak-dict" data-dictionary>
        <input
          className="ak-input"
          type="search"
          data-dict-input
          placeholder="ことばを引く（例: 一旦）"
          aria-label="ことばを引く"
        />
        <div className="ak-dict-result" data-dict-result aria-live="polite">
          見出し語は{WORDS.length}語です。出典は本人の体感。
        </div>
      </div>
      <List>
        {WORDS.map((entry) => (
          <ListRow
            key={entry.word}
            icon="📖"
            color="cream"
            title={entry.word}
            desc={entry.means}
            meta={entry.reading}
            action
            data-dict-word={entry.word}
          />
        ))}
      </List>
      <Note>類語辞典もあります。「一旦」と「ひとまず」と「とりあえず」は、すべて同じ意味でした。</Note>
    </AppDoc>
  )
}

const SHORTCUTS = [
  { icon: '🍈', label: 'システム情報', cmd: 'neofetch', color: 'melon' as const },
  { icon: '👤', label: 'じぶんを確かめる', cmd: 'whoami', color: 'cherry' as const },
  { icon: '🗂', label: 'デスクトップを見る', cmd: 'ls', color: 'soda' as const },
  { icon: '☕️', label: 'コーヒーを淹れる', cmd: 'coffee', color: 'cream' as const },
  { icon: '🎬', label: 'クレジットを流す', cmd: 'credits', color: 'lavender' as const },
]

export function ShortcutsBody() {
  return (
    <AppDoc>
      <Grid cols={2}>
        {SHORTCUTS.map((shortcut) => (
          <Tile
            key={shortcut.cmd}
            icon={shortcut.icon}
            label={shortcut.label}
            sub={`$ ${shortcut.cmd}`}
            color={shortcut.color}
            data-shortcut={shortcut.cmd}
          />
        ))}
      </Grid>
      <div className="ak-console-slot" data-shortcut-out hidden />
      <Note>
        ここのショートカットは、本当にターミナルのコマンドを走らせます。
        <span className="pc-only">結果はこの下と、ターミナルのウィンドウに出ます。</span>
        <span className="sp-only">SPにターミナルは無いので、結果はこの下にだけ出ます。安全です。</span>
      </Note>
    </AppDoc>
  )
}

const TIPS = [
  {
    title: 'デスクトップを右クリック',
    body: '壁紙を変えたり、再起動したりできます。ウィンドウの整列もここです。',
    pc: true,
  },
  { title: 'ターミナルで help', body: '隠しコマンドの一覧が出ます。sudo は通りません。', pc: true },
  {
    title: 'アイコンを長押し',
    body: 'ジグル編集になります。ターミナルだけは消せます（すぐ戻ってきます）。',
    pc: false,
  },
  {
    title: 'ステータスバーを引き下ろす',
    body: 'コントロールセンターが出ます。壁紙と明るさは本当に効きます。',
    pc: false,
  },
  { title: 'アプリの下端から上へスワイプ', body: 'ホームに戻ります。途中で止めるとAppスイッチャーです。', pc: false },
]

export function TipsBody() {
  return (
    <AppDoc>
      <AppHero icon="💡" title="今週のヒント" sub="来週の予定はありません" color="cream" />
      <List>
        {TIPS.map((tip) => (
          <div key={tip.title} className={tip.pc ? 'pc-only' : 'sp-only'}>
            <ListRow icon="💡" color="cream" title={tip.title} desc={tip.body} />
          </div>
        ))}
      </List>
      <Toolbar>
        <button type="button" className="os-button" {...opens('support')}>
          サポートに聞く
        </button>
        <button type="button" className="os-button" {...opens('about')}>
          このOSについて
        </button>
      </Toolbar>
      <Note>ヒントを全部読んでも、インフラは得意になりません。それは本人も同じです。</Note>
    </AppDoc>
  )
}

export function SupportBody() {
  return (
    <AppDoc>
      <AppHero icon="🛟" title="tomokiOS サポート" sub="担当者は本人ひとりです" color="cherry" />
      <Section title="よくある質問">
        <List>
          <ListRow
            icon="❓"
            color="cherry"
            title="保存したメモが消えました"
            desc="仕様です。保存先がメモリなので、閉じると消えます。"
            action
            data-quip="仕様です。残らないことが、このメモ帳のいちばんの特徴です。"
          />
          <ListRow
            icon="❓"
            color="cherry"
            title="ストレージが残り1KBです"
            desc="じゅうぶんです。640KBあれば足ります。"
            action
            data-quip="640KBあればじゅうぶんです。ずっとそう言われてきました。"
          />
          <ListRow
            icon="❓"
            color="cherry"
            title="ゴミ箱の infra.zip を復元したい"
            desc="復元は必ず失敗します。3回試すと、中身が少しだけ見えます。"
            action
            data-quip="3回目に発掘されるのは kubectl.exe（未使用）です。"
          />
          <ListRow
            icon="❓"
            color="cherry"
            title="音が鳴りません"
            desc="スピーカーがありません。経費削減されました。"
            action
            data-quip="このMacにスピーカーはありません。ターミナルの say も同じ返事をします。"
          />
        </List>
      </Section>
      <Toolbar>
        <button type="button" className="os-button" {...opens('messages')}>
          チャットで問い合わせる
        </button>
        <button type="button" className="os-button" {...opens('social')}>
          連絡先を見る
        </button>
      </Toolbar>
      <Note>受付時間は「起きているとき」です。深夜のほうがつながりやすい傾向にあります。</Note>
    </AppDoc>
  )
}

const PROCESSES = [
  { name: 'tomokiOS', cpu: '0.4', mem: '128 KB', note: '本体' },
  { name: 'なつかしさドライバ', cpu: '12.0', mem: '256 KB', note: 'いちばん重い' },
  { name: 'window-manager', cpu: '0.8', mem: '64 KB', note: 'ドラッグ担当' },
  { name: 'terminal (zsh)', cpu: '0.0', mem: '32 KB', note: '実権限なし' },
  { name: 'infra-layer', cpu: '—', mem: '—', note: '応答なし' },
  { name: 'coffee-daemon', cpu: '3.2', mem: '48 KB', note: '常駐' },
  { name: 'visitors-counter', cpu: '0.1', mem: '12 KB', note: '素通り検知' },
]

export function ActivityBody() {
  return (
    <AppDoc>
      <div className="ak-activity">
        <Sparkline
          points={[8, 14, 9, 22, 12, 30, 11, 16, 10]}
          color="melon"
          height={54}
          className="ak-activity-graph"
          data-activity-graph
        />
        <Meter label="CPU" value={16} color="melon" />
        <Meter label="メモリ（640KB中 639KB）" value={99.8} color="cherry" />
        <Meter label="ディスク" value={100} color="lavender" />
      </div>
      <div className="ak-table">
        <div className="ak-table-row ak-table-head">
          <span>プロセス</span>
          <span>CPU%</span>
          <span>メモリ</span>
        </div>
        {PROCESSES.map((proc) => (
          <div key={proc.name} className={`ak-table-row${proc.cpu === '—' ? ' is-dead' : ''}`}>
            <span>
              {proc.name}
              <em className="ak-row-hint">{proc.note}</em>
            </span>
            <span>{proc.cpu}</span>
            <span>{proc.mem}</span>
          </div>
        ))}
      </div>
      <Toolbar>
        <Quip label="プロセスを終了" quip="infra-layer を強制終了しました。もともと起動していませんでした。" danger />
      </Toolbar>
      <Note>いちばんCPUを使っているのは「なつかしさドライバ」です。これは仕様というより、性格です。</Note>
    </AppDoc>
  )
}

export function SysInfoBody() {
  return (
    <AppDoc>
      <Section title="ハードウェアの概要">
        <Rows>
          <Row label="モデル名" value="tomokiBook" />
          <Row label="プロセッサ" value="なつかしさ 100%" />
          <Row label="コア数" value="1" hint="集中したいので" />
          <Row label="メモリ" value="640 KB" hint="じゅうぶん" />
          <Row label="グラフィックス" value="ドット絵内蔵" />
          <Row label="シリアル番号" value="000640KB" />
          <Row label="稼働開始" value="2006年" />
        </Rows>
      </Section>
      <Section title="ソフトウェア">
        <Rows>
          <Row label="システム" value='tomokiOS 26.0.4 "Cream Soda"' />
          <Row label="カーネル" value="Next.js + OpenNext" />
          <Row label="実行環境" value="Cloudflare Workers" hint="インフラは他人にまかせた" />
          <Row label="ストレージ" value="Cloudflare KV（訪問者カウンタのみ）" />
        </Rows>
      </Section>
      <Note>唯一の永続データが「何人が素通りしたか」の数字です。優先順位は、たぶん間違っていません。</Note>
    </AppDoc>
  )
}

export function TimeMachineBody() {
  return (
    <AppDoc>
      <div className="ak-tm">
        <div className="ak-tm-stack" aria-hidden="true">
          <span />
          <span />
          <span />
          <span>2006</span>
        </div>
        <Rows>
          <Row label="バックアップ先" value="2006年" hint="容量は無限（過去なので）" />
          <Row label="最新のバックアップ" value="2006/06/06 06:06" />
          <Row label="次回" value="未定" />
        </Rows>
      </div>
      <Toolbar>
        <Quip label="今すぐバックアップ" quip="2006年に送信しました。到着の確認方法がありません。" />
        <Quip label="復元" quip="2006年の自分に戻ります。……よく考えたら、やめておきます。" danger />
      </Toolbar>
      <Note>過去に戻れるのは1回だけです。使いどころが難しいので、まだ使っていません。</Note>
    </AppDoc>
  )
}

export function ScreenShareBody() {
  return (
    <AppDoc>
      <div className="ak-add">
        <input className="ak-input" type="text" placeholder="ホスト名またはIPアドレス" aria-label="接続先" />
        <Quip label="接続" quip="接続先が見つかりませんでした。そもそも共有する相手がいません。" />
      </div>
      <Rows>
        <Row label="状態" value="待機中" />
        <Row label="共有相手" value="0 名" hint="募集はしていません" />
        <Row label="画質" value="実物大" />
      </Rows>
      <Note>画面を共有すると、机の上が映ります。片づけてからにしてください。</Note>
    </AppDoc>
  )
}

export function BluetoothBody() {
  return (
    <AppDoc>
      <Rows>
        <Row label="Bluetooth" value="ON" hint="いちおう" />
        <Row label="ペアリング済み" value="0 台" />
        <Row label="このアプリの起動回数" value="1 回" hint="いま" />
      </Rows>
      <Toolbar>
        <Quip label="ファイルを送信" quip="送信先のデバイスが見つかりませんでした。20年ずっとこの画面です。" />
        <Quip label="ファイルを受信" quip="待機を開始しました。誰も送ってきません。" />
      </Toolbar>
      <Note>入っているのは知っているけれど、使ったことはない。そういうアプリも、OSには必要です。</Note>
    </AppDoc>
  )
}

export function AirportBody() {
  return (
    <AppDoc>
      <div className="ak-radar" aria-hidden="true">
        <span className="ak-radar-sweep" />
        <span className="ak-radar-dot" />
      </div>
      <Rows>
        <Row label="検出されたベースステーション" value="0 台" />
        <Row label="製品の販売" value="終了しました" hint="2018年" />
        <Row label="思い出" value="いっぱい" />
      </Rows>
      <Toolbar>
        <Quip label="再スキャン" quip="スキャンしました。見つかりませんでした。もう作られていないので。" />
      </Toolbar>
      <Note>白くて丸い機械のことを、たまに思い出します。このアプリはそのために残してあります。</Note>
    </AppDoc>
  )
}

export function FontBookBody() {
  return (
    <AppDoc>
      <List>
        <ListRow
          icon="🔠"
          color="cream"
          title="DotGothic16"
          desc="UIクローム用。ドットの角が立っているのが好み。"
          meta="使用中"
        />
        <ListRow
          icon="🔡"
          color="cream"
          title="ヒラギノ角ゴ"
          desc="本文用。読みやすさは、こだわらないところで効く。"
          meta="使用中"
        />
        <ListRow
          icon="🚫"
          color="lavender"
          title="その他 0 書体"
          desc="増やすと迷うので、増やしていません。"
          meta="—"
        />
      </List>
      <div className="ak-fontsample">
        <span className="ak-fontsample-chrome">640KB あればじゅうぶん</span>
        <span className="ak-fontsample-body">640KB あればじゅうぶん</span>
      </div>
      <Note>2書体で足りています。書体を選ぶ時間は、だいたい本文を書く時間より長くなります。</Note>
    </AppDoc>
  )
}

export function ImageCaptureBody() {
  return (
    <AppDoc>
      <Rows>
        <Row label="デバイス" value="0 台" hint="スキャナは持っていません" />
        <Row label="読み込み先" value="デスクトップ" />
        <Row label="形式" value="PNG" />
      </Rows>
      <Toolbar>
        <Quip label="読み込む" quip="デバイスが接続されていません。紙のものは、写真アプリで撮ってください。" />
      </Toolbar>
      <Note>スキャナを持っていた時期があります。いまは、ぜんぶ写真で済ませています。</Note>
    </AppDoc>
  )
}

export function PreviewBody() {
  return (
    <AppDoc>
      <div className="ak-preview">
        <div className="ak-preview-canvas tile-soda">
          <span className="ak-preview-emoji" aria-hidden="true">
            🍈
          </span>
          <span className="ak-preview-title">tomokiOS 26</span>
        </div>
        <div className="ak-preview-meta">ogp.png ｜ 1200×630 ｜ 48 KB</div>
      </div>
      <Toolbar>
        <Quip label="注釈" quip="矢印を1本引きました。指す先が思いつきませんでした。" />
        <Quip label="PDFに書き出す" quip="書き出しました。開くとまた同じ画像が出てきます。" />
        <button type="button" className="os-button" {...opens('photos')}>
          写真でひらく
        </button>
      </Toolbar>
      <Note>このOSでいちばん外に出ている画像です。SNSでは、これしか見えていない人もいます。</Note>
    </AppDoc>
  )
}

export function QuickTimeBody() {
  return (
    <AppDoc>
      <div className="ak-qt">
        <div className="ak-qt-screen" aria-hidden="true">
          ▶
        </div>
        <div className="ak-qt-bar">
          <span className="ak-qt-progress" />
        </div>
        <div className="ak-player-times">
          <span>00:00</span>
          <span>00:00</span>
        </div>
      </div>
      <Toolbar>
        <Quip label="新規画面収録" quip="収録を開始しました。……このOSの中を撮っても、このOSが映るだけです。" />
        <Quip label="新規ムービー収録" quip="カメラがありません。カメラアプリのほうが、まだ撮れます。" />
      </Toolbar>
      <Console
        lines={[
          '# 収録済みのファイル',
          '（なし）',
          '',
          '# ヒント',
          'このアプリは、だいたい画面収録のためだけに開かれます。',
        ]}
      />
      <Note>再生機能もありますが、再生するものがありません。用途がひとつに絞られた、正しいアプリです。</Note>
    </AppDoc>
  )
}
