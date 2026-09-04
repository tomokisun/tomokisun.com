# tomokisun.com — tomokiOS 26 "Cream Soda"

tomokisunの個人サイト。ホームページを1枚のウェブページではなく、**架空のパステルカラーOS**として作っています。
PCで開けばウィンドウ型のデスクトップ、スマートフォンで開けばロック画面とホーム画面。
iOS / macOS にプリインストールされているアプリを一通り再現していて、いまは **70個** 入っています。

> **このサイトに「OSの外のページ」はありません。**
> `/blog/wablo` のような共有可能なURLも、独立したページを描くのではなく
> 「OSを起動して、ブログアプリをその記事で開く」ためのディープリンクです。

## 技術スタック

- **Next.js（App Router）** — サーバーコンポーネントで静的なDOMを描く
- **OpenNext（`@opennextjs/cloudflare`）+ Cloudflare Workers** — 実行環境
- **Cloudflare KV** — 訪問者カウンター（このサイトで唯一の永続データ）
- **Tailwind CSS v4 + 手書きCSS** — トークンとレイアウトは`app/globals.css`に集約
- **Bun** — パッケージマネージャ / タスクランナー
- **Biome** — リンタ / フォーマッタ

UIの動きにReactは使っていません。サーバーが静的なDOMを描き、`lib/`のバニラTypeScriptが
`data-*`属性を拾って配線します。ハイドレーションのコストを払わずに、OSらしい手触りを出すためです。

## 実行

```bash
bun install
bun dev              # 開発サーバー（Turbopack）
bun run build        # 本番ビルド
bun run preview      # OpenNextビルド + Wranglerでローカルプレビュー
bun run deploy       # Cloudflare Workersへデプロイ
bun run typecheck    # tsc --noEmit
bun run lint         # Biome
```

## つくり

### アプリレジストリ（`data/apps.ts`）

OSに存在するアプリは`data/apps.ts`の1箇所で定義します。そこから

- **PC**: デスクトップアイコン / Dock / Launchpad / Spotlight / 各ウィンドウ（位置も）
- **SP**: ホーム画面のページ / ドック / App ライブラリ / Appスイッチャー / ジグル編集の削除拒否コピー
- **ターミナル**: `open <なまえ>` と `ls apps`

がすべて導出されます。アプリを1つ足す手順は2ステップです。

1. `data/apps.ts` に1エントリ足す
2. `components/apps/index.tsx` にID→本体を1行足す

### アプリの本体はOSに1つだけ（`lib/os/adopt.ts`）

サーバーは**PCのウィンドウの中にだけ**アプリの本体を描き、SPのアプリ画面は空の器として置きます。
起動時と768px境界をまたいだときに、本体を「いま見えているほうの器」へ`appendChild`で引っ越します。

- 70個を両方の画面に描くとHTMLがほぼ倍になる（実測 gzip後 196KB → 136KB）
- 状態が二重に存在しない（片方の電卓だけ答えが違う、が起きない）
- `appendChild`は移動なので、イベントリスナもCanvasの絵もそのまま残る
- SEOとJS無効時の表示はPC側のDOMが担う

そのためアプリ本体は「いまどちらの画面か」を知りません。文言を変えたいときは`.pc-only` / `.sp-only`で出し分けます。
アプリ同士の行き来は`data-app-open`に統一し、PCはウィンドウ、SPはアプリ画面として解釈します。

### 共通パーツ（`components/apps/kit.tsx`）

リスト・タイル・タブ・メーター・折れ線・アクティビティリング・吹き出し・端末風の箱などを共通化しています。
70個のアプリはこの組み合わせでできているので、ここを触ると全アプリの見た目が変わります。

## 入っているアプリ

**ユーティリティ**: ゴミ箱 / 設定 / このOSについて / ファイル / 探す / 拡大鏡 / 辞書 / ショートカット / ヒント /
サポート / アクティビティモニタ / システム情報 / タイムマシン / 画面共有 / Bluetooth交換 / AirMacユーティリティ /
Font Book / イメージキャプチャ / プレビュー / QuickTime Player

**仕事と作成**: プロフィール / Products / メモ帳 / 電卓 / 時計 / カレンダー / リマインダー / 表計算 / 文書 /
スライド / フリーボード / ジャーナル / スティッキーズ / テキストエディット

**つながり**: ソーシャル / メッセージ / メール / ビデオ通話 / 電話 / 連絡先 / インビテーション

**メディア**: ブログ / ブラウザ / ミュージック / クラシック / ポッドキャスト / テレビ / ブック / 写真 / カメラ /
ボイスメモ / これなに？ / アプリストア / iTunes Store / tomokiストア

**くらし**: 天気 / マップ / コンパス / ヘルスケア / フィットネス / ホーム / ウォレット / 翻訳 / 株価

**開発・あそび**: ターミナル / Xcode / オートメーター / スクリプトエディタ / グラフ計算機 / ポーカー

### 本当に動くもの

ストップウォッチ・タイマー・世界時計、カレンダー、リマインダーの追加とチェック、メッセージの自動応答、
ミュージックの再生位置、カメラで撮ると写真アプリに増える、ボイスメモの録音時間、フリーボードの手描き、
表計算の合計、翻訳、辞書の検索、グラフ計算機、ポーカーの役判定、
ショートカット（押すと本当にターミナルのコマンドを走らせます）。

## OSとしての振る舞い

**PC（≥768px）**
- Dock — 近づいたアイコンが持ち上がる。実行中は下に点がつき、しまったウィンドウは右の棚に積まれる
- Launchpad / Spotlight（⌘K・⌘Space）/ Mission Control
- トラフィックライトは3つとも機能する（閉じる・しまう・拡大）。タイトルバーのダブルクリックで拡大
- ウィンドウのドラッグとリサイズ、メニューバーのメニュー、通知センター
- デスクトップの右クリックメニュー（壁紙変更・整列・再起動）

**SP（<768px）**
- ロック画面のスワイプ解除、ホーム画面のページめくり、App ライブラリ、下に引いて検索
- アイコンからのFLIPズーム起動、下端からのスワイプでホーム、途中で止めるとAppスイッチャー
- コントロールセンター、通知バナー、長押しのジグル編集

ジェスチャーはすべて`lib/sp/gesture.ts`の1本のエンジンで実装しています。
指に1:1で追従し、離した瞬間の速度を減衰スプリング（`springTo`）が引き継ぎます。
CSS transitionは追従しないマイクロ演出だけに使っています。

## ディレクトリ

```
app/
  page.tsx                 # デスクトップ／ホーム画面（force-dynamic）
  blog/page.tsx            # ブログアプリを開くディープリンク
  blog/[slug]/page.tsx     # その記事を開くディープリンク（metadata / JSON-LDはここ）
  sitemap.ts               # 記事から自動生成
  globals.css              # デザイントークンと全スタイル
components/
  OsPage.tsx               # OSの唯一の入口（どのURLもこれを返す）
  apps/                    # アプリの本体（kit.tsx + ジャンル別ファイル + index.tsx）
  desktop/                 # PC版（Desktop / MenuBar / Window / Dock / Launchpad / Spotlight …）
  mobile/                  # SP版（MobileShell / HomeScreen / AppView / ControlCenter …）
  blog/posts/              # 記事本文（pc / sp の2バリアントで共有）
data/
  apps.ts                  # アプリレジストリ
  blog-posts.ts / products.ts / social-links.ts
lib/
  os/                      # OSクローム（windows / dock / spotlight / adopt / terminal …）
  apps/                    # 各アプリの中身
  sp/                      # SP（ジェスチャー・状態機械・ホーム・ロック・スイッチャー …）
  deeplink.ts / ui.ts / visitors.ts
```

## デザインの決まりごと

- パステルカラー（`--os-*`変数）＋2pxのインク色ボーダー＋ぼかしなしのハードシャドウ
- UIクロームは等幅（DotGothic16）、本文はゴシック体
- 遊び心はコピーで出す。**新しい要素にも必ず小ネタを仕込む**（「640KBあればじゅうぶん」「素通り禁止」）
- 押しても何も起きないボタンを作らない（ネタで済むものは`<Quip />`）
- ジェスチャーには必ずボタン等の代替手段を用意する
- アクセシビリティ（aria属性、inert、フォーカスリング、prefers-reduced-motion）は維持する

詳しい開発指針は[CLAUDE.md](./CLAUDE.md)、トーンについては[docs/tone-and-manner.md](./docs/tone-and-manner.md)にあります。

## ライセンス

© 2006–2026 tomokisun. 権利はだいたい本人にあります。
