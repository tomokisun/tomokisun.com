# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## 根幹ルール: すべては「アプリの中」で動く（絶対厳守）

**このサイトに「OSの外のページ」を作ってはいけない。** PC・スマートフォンを問わず、
ユーザーが目にするあらゆるコンテンツは、tomokiOSのウィンドウ（PC）またはアプリ画面（SP）の
中で開かれていなければならない。iOS / macOS をウェブ上で再現することがこのサイトの目的であり、
「素のウェブページ」に着地させた時点でその世界観は壊れる。

具体的に守ること:

1. **ページ遷移でコンテンツを見せない。** アプリを開く／記事を読む／詳細を見る、はすべて
   `data-app-open`（アプリの中から）と`data-open` / `data-sp-open`（OSのクロームから）で完結させる。
2. **「単体ページでひらく」のような、OSの外へ出す導線を作らない。** 追加も復活も禁止。
3. **URLは「ページ」ではなく「ディープリンク」。** `/blog/<slug>` のような共有可能なURLは残すが、
   それは独立ページを描くためではなく、**OSを起動してそのアプリをその状態で開く**ためのもの。
   実装は`lib/deeplink.ts`の`DeepLink`型 → `components/OsPage.tsx` → `initOS({ deepLink })`。
   新しいルートを足すときも必ず`OsPage`を返し、独自のページchromeを作らない。
4. **SEO・OGPはルート側のmetadataとJSON-LDで担保する。** 見た目のためにOSの外へ出さない。
   本文はウィンドウ／アプリの中にサーバーレンダリングされているので、それで足りる。
5. **外部サイトへのリンク（GitHub・App Store・SUZURI等）は例外。** それは「OSの外」ではなく
   「別のマシン」なので`target="_blank"`で出してよい。

## プロジェクト概要
Next.js（App Router）+ OpenNext（`@opennextjs/cloudflare`）で構築された個人ウェブサイト。サイト全体が「tomokiOS 26 "Cream Soda"」という架空のパステルカラーOSのデスクトップ／ホーム画面として表現される。Cloudflare Workers上で動作し、KVストレージを`getCloudflareContext()`経由で使用。

## 必須コマンド

### 開発
```bash
bun dev              # Next.js（Turbopack）で開発サーバーを起動
bun run build        # 本番用ビルド（next build）
bun run preview      # OpenNextビルド + Wranglerでローカルプレビュー
bun run deploy       # OpenNextビルド + Cloudflare Workersへデプロイ
bun run typecheck    # 型チェック（tsc --noEmit）
bun run lint         # Biomeでリント
```

## アーキテクチャと主要パターン

### tomokiOS 26 "Cream Soda" のコンセプト
サイトは1つの`app/page.tsx`にPC用デスクトップとSP用ホーム画面の両方を常にレンダリングし、CSSのメディアクエリ（768px境界）で表示を切り替える（`app/globals.css`の`.os-desktop-shell` / `.sp-shell`）。iOS / macOS にプリインストールされているアプリを一通り再現することを目標にしていて、現在70個のアプリが入っている。

### アプリレジストリ（data/apps.ts）— アプリの唯一の真実
OSに存在するアプリは`data/apps.ts`の`apps`配列1箇所で定義する。ここから以下がすべて導出される：

- PC: デスクトップアイコン（`desktop: true`）／Dock（`dock: true`）／Launchpad（全部）／Spotlight／各ウィンドウ（位置は`geometry`）
- SP: ホーム画面のページ（`page: 0|1|2`）／ドック（`spDock: true`）／App ライブラリ（全部）／Appスイッチャーのカード（`lib/sp/meta.ts`）／ジグル編集の削除拒否コピー（`removeRefusal`）
- ターミナルの`open <なまえ>`と`ls apps`（`keywords`が別名になる）

**アプリを1つ足す手順は2ステップだけ**:
1. `data/apps.ts`の`apps`に1エントリ足す
2. `components/apps/index.tsx`の`appBodies`にID→本体を1行足す

`page`を指定しないアプリはApp ライブラリにだけ並ぶ（「持ってはいるがホーム画面に出していない」状態を再現している）。

### アプリの本体はOSに1つだけ（lib/os/adopt.ts）
サーバーは**PCのウィンドウの中にだけ**本体を描き、SPのアプリ画面は`data-app-slot`を持つ空の器として置く。起動時と768px境界をまたいだときに、本体を「いま見えているほうの器」へ`appendChild`で引っ越す。

- 70個を両画面に描くとHTMLがほぼ倍になる（実測 gzip後 196KB → 136KB）
- 状態が二重に存在しない（片方の電卓だけ答えが違う、が起きない）
- `appendChild`は移動なので、付けたイベントリスナも Canvas の絵もそのまま残る
- SEOとJS無効時の表示はPC側のDOMが担う

**したがってアプリ本体は「いまどちらの画面か」を知ってはいけない。** 画面ごとに文言を変えたいときはJSXの分岐ではなく`.pc-only` / `.sp-only`クラスを使う。形がPCと違うブログとProductsだけが例外で、SP専用の本体を持つ（`MobileShell.tsx`の`SP_SPECIFIC`）。

アプリ同士の行き来は`data-app-open="<id>"`に統一する（PCはウィンドウ、SPはアプリ画面として解釈する）。`data-open` / `data-sp-open`はOSのクローム側（アイコン・Dock・メニュー）専用。

### アプリの中身
- `components/apps/kit.tsx` - 全アプリ共通のパーツ（`AppDoc` `AppHero` `Section` `Rows/Row` `List/ListRow` `Grid/Tile` `Note` `Toolbar` `Quip` `Meter` `Sparkline` `Rings` `Chips` `Segmented/SegPane` `Bubble` `Console`）。クラス名は`ak-`始まり。**追加より再利用を優先すること**
- `components/apps/{core,time,comms,media,life,work,utils,dev}.tsx` - 各アプリの本体をジャンルごとにまとめたもの
- `components/apps/{CalculatorBody,NotepadBody,TerminalBody}.tsx` - 単体で大きいもの
- `components/apps/index.tsx` - ID→本体の表
- 押しても何も起きないボタンを作らないこと。ネタで済むものは`<Quip label="…" quip="…" />`（`[data-quip]`→トースト）を使う

主なアプリのネタ:
- `プロフィール.txt` - 自己紹介と職歴（テキストエディタ風）
- `Products` - プロダクト一覧（PCはアイコングリッド＋詳細ウィンドウ、SPは外部リンクのリスト。買収済みは🔒）
- `メモ帳` / `文書` / `テキストエディット` / `ジャーナル` / `スティッキーズ` - 書けるが残らない（保存先はメモリ）
- `電卓` - 四則演算のみ。0除算は「むり」、桁があふれると「けたあふれ」
- `時計` - 世界時計・ストップウォッチ・タイマーは本当に動く（このOSでいちばん実用的）
- `ターミナル` - PC専用。SPでは開けず専用ダイアログを出す（スイッチャーには「応答なし」で常駐し、killしても復活する）
- `ショートカット` - 押すと本当に`runCommand()`を叩く
- `ブログ` - 記事いちらんと本文の両方がOSの中で完結する
- `ゴミ箱` - infra.zip（「インフラは苦手」の自虐ネタ。復元は必ず失敗する）
- `株価` - INFR（インフラ層ホールディングス）だけ -99.9%
- `ポーカー` - 役判定は本物。チップは何回負けても640に戻る

### コンポーネント構造
- `components/apps/` - アプリの本体（上記）。PCは`Window`、SPは`AppView`でくるむだけ
- `components/desktop/` - PC版デスクトップ一式
  - `Desktop.tsx` - 組み立て（MenuBar + DesktopIcons + レジストリから生やすWindow群 + Dock + Launchpad + Spotlight + NotificationCenter）
  - `DesktopIcons.tsx` - デスクトップアイコン（macOSと同じく右端）
  - `MenuBar.tsx` - 上部メニューバー（🍈メニュー／ファイル／表示／ヘルプ、時計、ログイン中人数）。手前のウィンドウ名が`[data-menubar-app]`に入る
  - `Window.tsx` - ウィンドウのchrome。トラフィックライトは3つとも機能する（閉じる／しまう／拡大）。初期位置は`--win-*`カスタムプロパティで渡す
  - `Dock.tsx` / `Launchpad.tsx` / `Spotlight.tsx` / `NotificationCenter.tsx`
  - `windows/` - レジストリに乗らない特殊ウィンドウ（BlogPostWindows, ProductDetailWindows）
- `components/mobile/` - SP版ホーム画面一式
  - `MobileShell.tsx` - 組み立て（StatusBar + HomeScreen + Dock + LockScreen + Notification + ControlCenter + AppSwitcher + SearchSheet + レジストリから生やすAppView群）
  - `HomeScreen.tsx` - ページを横に並べたレール＋ページドット＋App ライブラリ
  - `LockScreen.tsx` / `Dock.tsx` / `StatusBar.tsx` / `Notification.tsx` / `TerminalBlockedDialog.tsx` / `SearchSheet.tsx`
  - `ControlCenter.tsx` - ステータスバーから引き下ろす1枚シート（壁紙・明るさ・画面ロック・再起動は実動、機内モードと音量はネタ）
  - `AppSwitcher.tsx` - Appスイッチャーの器（カードは`lib/sp/switcher.ts`が生成）
  - `AppView.tsx` - アプリのフルスクリーンchrome。本体を持たないときは`data-app-slot`の器になる
- `components/blog/` - `posts/`が記事本文（`parts.tsx`に共有部品、`index.ts`がslug→本文の表）。同じ`/`にPC/SP両方のDOMが並ぶため、脚注のidは`anchorId()`でバリアントごとに分ける
- `components/OsPage.tsx` - OSの唯一の入口（どのURLもこれを返す）
- `components/OsClient.tsx` - `initOS({ deepLink })`を呼び出すクライアントエントリ（`'use client'`）

### ルーティング
Next.js App Router（`app/`）。**どのルートも`OsPage`を返す**（根幹ルール参照）。
- `app/page.tsx` - デスクトップ／ホーム画面。`dynamic = 'force-dynamic'`
- `app/blog/page.tsx` - ブログアプリを開くディープリンク。`app/blog/[slug]/page.tsx` - その記事を開くディープリンク（metadataとJSON-LDはここが持つ）
- `app/sitemap.ts` - `data/blog-posts.ts`から自動生成
- `app/layout.tsx` - メタデータ（OGP/Twitterカード）、JSON-LD（WebSite/Person）、フォント設定
- `app/not-found.tsx` / `app/error.tsx` - OS風のシステムエラーダイアログ（ERROR 404 / ERROR 500）

### クライアントサイド（lib/os/ + lib/apps/ + lib/sp/）
`lib/os/index.ts`が組み立てだけを行う入口。中身は以下に分かれている。

**OSクローム（lib/os/、PCのみ動くものが多い）**
- `windows.ts` - 開閉・フォーカス（z-index）・ドラッグ・リサイズ・しまう（Dockの棚へ）・拡大・Mission Control・起動元からのFLIP。⌘W / ⌘M も拾う
- `dock.ts` - 近づいたアイコンが持ち上がる拡大効果 / `launchpad.ts` / `spotlight.ts`（⌘K・⌘Space）/ `menubar.ts`（`data-menu-action`で実行）/ `notificationCenter.ts`
- `search.ts` - SpotlightとSP検索の共通インデックス（アプリ＋ブログ＋プロダクト）
- `adopt.ts` - 本体の引っ越し（上記）
- `terminal.ts` - `runCommand()`は単体で呼べる純粋な関数。別名はレジストリの`keywords`から自動生成
- `wallpaper.ts` - 壁紙（`cycleWallpaper` / `getWallpaperLabel`はSPのコントロールセンターと設定アプリからも使う）
- `desktopExtras.ts` - 起動画面・時計・ゴミ箱・右クリックメニュー・タブ離脱検知

**アプリの中身（lib/apps/）**
- `common.ts` - `setupQuips()`（`[data-quip]`）と`setupSegmented()`（タブ）。全アプリ共通の配線はここ
- `calculator.ts` / `notepad.ts` / `time.ts` / `media.ts` / `life.ts` / `work.ts` / `dev.ts`
- 本体はOSに1つなので`querySelectorAll`は「念のため」であって「両画面ぶん」ではない

**SP（lib/sp/、`initOS()`が768px未満のときだけ`initSp()`を呼ぶ）**
- `gesture.ts` - 共通ジェスチャーエンジン。全ジェスチャーはこれ1本（`createGesture`、Pointer Eventsのみ、rAFスロットリング、軸ロック、速度追跡）。物理は`springTo`（減衰スプリング）と`rubber`（ラバーバンド）。`preventDefault`は書かずCSSの`touch-action`で抑止する。**同時にエンゲージできるのは画面で1本だけ**なので、入れ子で2本置くと外側が死ぬ（ホームのページめくりと下引き検索は1本にまとめてある）
- `state.ts` - SP状態機械。`.sp-shell`の`data-sp-mode`属性（locked/home/app/switcher/cc/edit）が唯一の真実。`setMode()`一箇所で遷移し、`inert`の付け外しもここに一元管理。z-index台帳コメントあり
- `home.ts` - ホーム画面のページめくり（1:1追従＋速度引き継ぎ、端はラバーバンド）と下に引いて検索
- `apps.ts` - アイコン位置からのFLIPズーム起動、ジェスチャーバーの1:1追従→速度引き継ぎクローズ、ドラッグ途中静止でスイッチャー進入、押し込みフィードバック（`.is-pressed`）
- `lock.ts` - スワイプ解除（1:1追従＋パララックス）。タップもキーボードも同じ合成スワイプ経路
- `controlCenter.ts` / `notify.ts`（`pushNotification()` API）/ `switcher.ts` / `search.ts` / `edit.ts`（長押しジグル編集。削除は拒否されるがターミナルだけ消えて5秒後に再インストールされる）
- `blog.ts` - ブログアプリの中の階層ナビ（いちらん ⇄ きじ）。左端28pxからのスワイプ・`‹ いちらん`・Escapeで戻る
- `meta.ts` - `data/apps.ts`から導出したSP用メタ情報

**共通**
- `lib/ui.ts` - `showToast` / `showSpDialog`（PC・SPどちらからも呼ぶ）
- `lib/deeplink.ts` - URL→アプリの対応（根幹ルール参照）
- 壁紙は`localStorage`（`tomokios-wallpaper`）、起動フラグは`sessionStorage`（`tomokios-booted`）に保存。この2キー以外は増やさない（機内モード等はメモリのみ）

### ストレージ
- **Cloudflare KV**: 訪問者カウンター用のキーバリューストレージ（`lib/visitors.ts`、`KV`バインディング、キー`VISITORS_COUNT`）
  - `getCloudflareContext({ async: true })`（`@opennextjs/cloudflare`）経由で`env.KV`を取得
  - メニューバー／ロック画面に「N人がログイン中」として表示

### Cloudflare / OpenNext設定
- `wrangler.jsonc` - `main: ".open-next/worker.js"`、`assets`（`.open-next/assets`）、`kv_namespaces`（`KV`）、`env.preview`（`workers_dev: true`、name: `tomokisun-com-preview`）を定義
- `open-next.config.ts` - OpenNext Cloudflareアダプタの設定（`defineCloudflareConfig({})`）
- `next.config.ts` - `initOpenNextCloudflareForDev()`を呼び出し、開発時もCloudflareバインディングにアクセス可能にする

## デザインガイドライン
tomokiOS 26 "Cream Soda" の世界観を維持：
- パステルカラー（`app/globals.css`の`--os-*`変数：インク#26233f、ペーパー#fdfbf1、ソーダ#8fd6e8、チェリー#ff8fa3、メロン#9fe6b8、クリーム#ffdf8a、ラベンダー#c9befa、グレープ#5b4bc4）
- 2pxのインク色ボーダー + ハードシャドウ（ぼかしなし）でピクセル感を統一
- UIクロームは等幅フォント、本文はゴシック体（DotGothic16）
- 遊び心はコピーで出す（「640KBあればじゅうぶん」「素通り禁止」等）。新しい要素にも必ず小ネタを仕込むこと
- PC（≥768px）はウィンドウ型デスクトップ、SP（<768px）はロック画面＋ホーム画面＋アプリ型UIに完全に出し分ける（`components/desktop/` と `components/mobile/` の二系統）
- SPは「本物のスマホOS」の物理を持つ: ジェスチャーは指に1:1追従し、離した瞬間の速度を`springTo`が引き継いで収束する。CSS transitionは非追従のマイクロ演出だけに使い、共通イージングは`--sp-ease`。ジェスチャーには必ずボタン等の代替手段を用意する（ジェスチャーバー自体がbutton、◀ ホーム、Escape等）
- SPのCSS禁止事項: `.sp-app-view`内に`position:fixed`を置かない（transformがcontaining blockを作る）／`.sp-shell`自体にtransform/filterを掛けない
- 画面ごとの文言の出し分けは`.pc-only` / `.sp-only`で行う（アプリ本体に画面の分岐を書かない）
- レスポンシブとアクセシビリティ（aria属性、inert、フォーカスリング、prefers-reduced-motion）は維持
