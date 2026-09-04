# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## 根幹ルール: すべては「アプリの中」で動く（絶対厳守）

**このサイトに「OSの外のページ」を作ってはいけない。** PC・スマートフォンを問わず、
ユーザーが目にするあらゆるコンテンツは、tomokiOSのウィンドウ（PC）またはアプリ画面（SP）の
中で開かれていなければならない。iOS / macOS をウェブ上で再現することがこのサイトの目的であり、
「素のウェブページ」に着地させた時点でその世界観は壊れる。

具体的に守ること:

1. **ページ遷移でコンテンツを見せない。** アプリを開く／記事を読む／詳細を見る、はすべて
   ウィンドウの`data-open`（PC）とアプリ／ペインの`data-sp-open`（SP）で完結させる。
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
サイトは1つの`app/page.tsx`にPC用デスクトップとSP用ホーム画面の両方を常にレンダリングし、CSSのメディアクエリ（768px境界）で表示を切り替える（`app/globals.css`の`.os-desktop-shell` / `.sp-shell`）。ウィンドウ／アプリの内容：
- `プロフィール.txt` - 自己紹介と職歴（テキストエディタ風）
- `Products` フォルダ - プロダクト一覧（アイコングリッド、各アプリの詳細ウィンドウ付き。買収済みは🔒と「買収済」バッジ）
- `ソーシャル` - SNSリンク一覧
- `メモ帳` / `電卓` - プリセットアプリ。中身は`components/apps/`（PC/SP共通のボディ）、動きは`lib/apps/`。メモ帳の保存はメモリ上だけ（残らないのがネタ）、電卓は四則演算のみで0除算は「むり」、桁があふれると「けたあふれ」
- `ターミナル` - クライアントサイドで動く対話型シェル（help/whoami/ls/open等の隠しコマンド）。SPでは開けず専用ダイアログを表示（スイッチャーにも「応答なし」で常駐し、killしても復活する）
- `ブログ` - 記事いちらんと記事本文の両方がOSの中で完結する。PCはいちらんウィンドウ（`BlogWindow.tsx`）→ 記事ウィンドウ`blog-<slug>`（`BlogPostWindows.tsx`）、SPはアプリ内の階層ナビ（`BlogApp.tsx` + `lib/sp/blog.ts`。右から入って左端スワイプで戻る）。本文は`components/blog/posts/`の1本をpage/pc/spの3バリアントで共有し、`/blog/<slug>`の独立ページは共有URL・SEO用に残す（benji.org リスペクトの短文スタイル）
- `ゴミ箱` - infra.zip（「インフラは苦手」の自虐ネタ。復元は必ず失敗する）
- `設定` - OS名/ビルド番号/ストレージ容量などのネタを詰めた設定パネル
- `このOSについて` - MenuBarのロゴ／メニュー項目から開くAboutダイアログ（`AboutWindow.tsx`）

### コンポーネント構造
- `components/apps/` - PC/SP共通のアプリ本体（`CalculatorBody`, `NotepadBody`）。PCは`Window`、SPは`AppView`でくるむだけで、中身と`data-*`属性は1箇所にまとめる
- `components/desktop/` - PC版デスクトップ一式
  - `Desktop.tsx` - デスクトップ全体の組み立て（MenuBar + DesktopIcons + 各Window）
  - `DesktopIcons.tsx` - デスクトップアイコン
  - `MenuBar.tsx` - 上部メニューバー（時計・ログイン中人数表示）
  - `Window.tsx` - ウィンドウのchrome（タイトルバー・ボディ・ステータスバー）
  - `windows/` - 各ウィンドウの中身（AboutWindow, BlogWindow, BlogPostWindows, ProductsWindow, ProductDetailWindows, ProfileWindow, SettingsWindow, SocialWindow, TerminalWindow, TrashWindow）
- `components/mobile/` - SP版ホーム画面一式
  - `MobileShell.tsx` - SP全体の組み立て（StatusBar + HomeScreen + Dock + LockScreen + Notification + ControlCenter + AppSwitcher + 各AppView）
  - `LockScreen.tsx` / `HomeScreen.tsx` / `Dock.tsx` / `StatusBar.tsx` / `Notification.tsx` / `TerminalBlockedDialog.tsx`
  - `ControlCenter.tsx` - ステータスバーから引き下ろす1枚シート（壁紙・明るさ・画面ロック・再起動は実動、機内モードと音量はネタ）
  - `AppSwitcher.tsx` - Appスイッチャーの器（カードは`lib/sp/switcher.ts`が生成。ターミナルは常駐して終了できない）
  - `AppView.tsx` - アプリのフルスクリーンchrome（ヘッダー + 本文 + 下端ジェスチャーバー）
  - `apps/` - 各アプリの中身（BlogApp, ProductsApp, ProfileApp, SettingsApp, SocialApp, TrashApp）
- `components/blog/` - ブログ。`BlogShell.tsx`が独立ページのchrome、`posts/`が記事本文（`parts.tsx`に共有部品、`index.ts`がslug→本文の表）。同じ`/`にPC/SP両方のDOMが並ぶため、脚注のidは`anchorId()`でバリアントごとに分ける
- `components/OsClient.tsx` - `initOS()`を呼び出すクライアントエントリ（`'use client'`）

### ルーティング
Next.js App Router（`app/`）。デスクトップ／ホーム画面は`/`のみに統一され、開くウィンドウ／アプリの出し分けは行っていない（旧`/products`, `/accounts`ルートは廃止）。ブログだけは共有可能なURLを持つ独立ルート：
- `app/page.tsx` - KVから訪問者数を取得し、Desktop・MobileShell・OsClientを描画。`dynamic = 'force-dynamic'`
- `app/blog/page.tsx` - ブログいちらん（`data/blog-posts.ts`から生成）。`app/blog/<slug>/page.tsx` - 各記事（例: `/blog/wablo`。本文は`components/blog/posts/`から`variant="page"`で描く）。どちらも`components/blog/BlogShell.tsx`（壁紙＋静的ウィンドウ1枚のページchrome、PC/SP共通）でOSの世界観を維持し、JSON-LD（BlogPosting）とOGPを持つ
- `app/layout.tsx` - メタデータ（OGP/Twitterカード）、JSON-LD（WebSite/Person）、フォント設定
- `app/not-found.tsx` / `app/error.tsx` - OS風のシステムエラーダイアログ（ERROR 404 / ERROR 500）

### クライアントサイド（lib/os.ts + lib/sp/）
- PC（lib/os.ts）: ウィンドウ管理（ドラッグは768px以上のみ／`setupDrag`）、フォーカス（z-index／`focusWindow`）、開閉（`data-open`/`data-close`属性）、右クリックでOS風コンテキストメニュー（壁紙切替・再起動）
- 共通（lib/os.ts）: 起動画面（`setupBootScreen`、セッションごとに1回）、メニューバーの時計（`setupClock`）、ターミナル実行（`runCommand`/`setupTerminal`）、ゴミ箱（`setupTrash`）、壁紙（`cycleWallpaper`/`getWallpaperLabel`はexportされSPからも使う）
- プリセットアプリ（lib/apps/）: `calculator.ts`（状態機械`press()`＋`[data-calc]`への配線。ターミナルの`calc <しき>`用に`evaluateExpression`もexport）、`notepad.ts`（`[data-memo]`への配線）。PC・SPの両方のDOMが同時に存在するため`querySelectorAll`で全インスタンスに配線し、状態はインスタンスごとに持つ
- SP（lib/sp/、`initOS()`が768px未満のときだけ`initSp()`を呼ぶ）:
  - `gesture.ts` - 共通ジェスチャーエンジン。全ジェスチャーはこれ1本（`createGesture`、Pointer Eventsのみ、rAFスロットリング、軸ロック、速度追跡）。物理は`springTo`（減衰スプリング）と`rubber`（ラバーバンド）。`preventDefault`は書かずCSSの`touch-action`で抑止する
  - `state.ts` - SP状態機械。`.sp-shell`の`data-sp-mode`属性（locked/home/app/switcher/cc/edit）が唯一の真実。`setMode()`一箇所で遷移し、`inert`の付け外しもここに一元管理。z-index台帳コメントあり
  - `apps.ts` - アイコン位置からのFLIPズーム起動（visibility切替でスクロール位置保持）、ジェスチャーバーの1:1追従→速度引き継ぎクローズ、ドラッグ途中静止でスイッチャー進入、押し込みフィードバック（`.is-pressed`）
  - `lock.ts` - スワイプ解除（1:1追従＋パララックス）。タップもキーボードも同じ合成スワイプ経路。CCの「画面ロック」で再ロック可能（`hidden`切替、remove()しない）
  - `controlCenter.ts` / `notify.ts`（`pushNotification()` API、ロック解除後にタイマー起点）/ `switcher.ts` / `edit.ts`（長押しジグル編集。削除は拒否されるがターミナルだけ消えて5秒後に再インストールされる）
  - `blog.ts` - ブログアプリの中の階層ナビ（いちらん ⇄ きじ）。押すと右から入り、左端28pxから始めたスワイプ・`‹ いちらん`・Escapeで戻る。アプリを閉じても読みかけの位置は残す
  - `ui.ts` - `showToast`/`showSpDialog`、`meta.ts` - アプリのメタ情報と削除拒否コピー
- 壁紙は`localStorage`（`tomokios-wallpaper`）、起動フラグは`sessionStorage`（`tomokios-booted`）に保存。この2キー以外は増やさない（機内モード等はメモリのみ）
- `components/OsClient.tsx`の`useEffect`から`initOS()`を呼び、上記すべてのセットアップ関数を実行

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
- レスポンシブとアクセシビリティ（aria属性、inert、フォーカスリング、prefers-reduced-motion）は維持
