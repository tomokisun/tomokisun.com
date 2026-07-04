# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

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
- `ターミナル` - クライアントサイドで動く対話型シェル（help/whoami/ls/open等の隠しコマンド）。SPでは開けず専用ダイアログを表示
- `ゴミ箱` - infra.zip（「インフラは苦手」の自虐ネタ。復元は必ず失敗する）
- `設定` - OS名/ビルド番号/ストレージ容量などのネタを詰めた設定パネル
- `このOSについて` - MenuBarのロゴ／メニュー項目から開くAboutダイアログ（`AboutWindow.tsx`）

### コンポーネント構造
- `components/desktop/` - PC版デスクトップ一式
  - `Desktop.tsx` - デスクトップ全体の組み立て（MenuBar + DesktopIcons + 各Window）
  - `DesktopIcons.tsx` - デスクトップアイコン
  - `MenuBar.tsx` - 上部メニューバー（時計・ログイン中人数表示）
  - `Window.tsx` - ウィンドウのchrome（タイトルバー・ボディ・ステータスバー）
  - `windows/` - 各ウィンドウの中身（AboutWindow, ProductsWindow, ProductDetailWindows, ProfileWindow, SettingsWindow, SocialWindow, TerminalWindow, TrashWindow）
- `components/mobile/` - SP版ホーム画面一式
  - `MobileShell.tsx` - SP全体の組み立て（StatusBar + HomeScreen + Dock + LockScreen + Notification + 各AppView）
  - `LockScreen.tsx` / `HomeScreen.tsx` / `Dock.tsx` / `StatusBar.tsx` / `Notification.tsx` / `TerminalBlockedDialog.tsx`
  - `AppView.tsx` - アプリのモーダル的な画面chrome
  - `apps/` - 各アプリの中身（ProductsApp, ProfileApp, SettingsApp, SocialApp, TrashApp）
- `components/OsClient.tsx` - `initOS()`を呼び出すクライアントエントリ（`'use client'`）

### ルーティング
Next.js App Router（`app/`）。ページは`/`のみに統一され、開くウィンドウ／アプリの出し分けは行っていない（旧`/products`, `/accounts`ルートは廃止）：
- `app/page.tsx` - KVから訪問者数を取得し、Desktop・MobileShell・OsClientを描画。`dynamic = 'force-dynamic'`
- `app/layout.tsx` - メタデータ（OGP/Twitterカード）、JSON-LD（WebSite/Person）、フォント設定
- `app/not-found.tsx` / `app/error.tsx` - OS風のシステムエラーダイアログ（ERROR 404 / ERROR 500）

### クライアントサイド（lib/os.ts）
- PC: ウィンドウ管理（ドラッグは768px以上のみ／`setupDrag`）、フォーカス（z-index／`focusWindow`）、開閉（`data-open`/`data-close`属性）、右クリックでOS風コンテキストメニュー（壁紙切替・再起動）
- 共通: 起動画面（`setupBootScreen`、セッションごとに1回）、メニューバーの時計（`setupClock`）、ターミナル実行（`runCommand`/`setupTerminal`）、ゴミ箱（`setupTrash`）
- SP: ロック画面（`setupLockScreen`）、アプリ開閉（`setupMobileApps`）、通知（`setupNotification`）
- 壁紙は`localStorage`（`tomokios-wallpaper`）、起動フラグは`sessionStorage`（`tomokios-booted`）に保存
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
- レスポンシブとアクセシビリティ（aria属性、フォーカスリング、prefers-reduced-motion）は維持
