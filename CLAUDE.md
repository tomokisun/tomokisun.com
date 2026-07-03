# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要
HonoX（JSX対応のHonoフレームワーク）で構築された個人ウェブサイト。サイト全体が「tomokiOS」という架空のパステルカラーOSのデスクトップとして表現される。Cloudflare Workers上で動作し、KVストレージを使用。

## 必須コマンド

### 開発
```bash
bun dev              # Viteで開発サーバーを起動
bun run preview      # Wranglerでローカル開発プレビュー
bun run build        # 本番用ビルド（クライアント + サーバー）
bun run deploy       # ビルドしてCloudflare Workersにデプロイ
bun run typecheck    # 型チェック
bun run lint         # Biomeでリント
```

## アーキテクチャと主要パターン

### tomokiOSのコンセプト
サイトは1枚の「デスクトップ」で、コンテンツはすべて「ウィンドウ」として表示される：
- `プロフィール.txt` - 自己紹介と職歴（テキストエディタ風）
- `products` フォルダ - プロダクト一覧（アイコングリッド、各アプリの詳細ウィンドウ付き。買収済みは🔒と「買収済」バッジ）
- `ネットワーク環境設定` - SNSリンク一覧（infra-layer.sysだけ接続失敗しているのはネタ）
- `ターミナル` - クライアントサイドで動く対話型シェル（help/whoami/ls/open等の隠しコマンド）
- `ゴミ箱` - infra.zip（「インフラは苦手」の自虐ネタ。復元は必ず失敗する）
- `このOSについて` - Aboutダイアログ

### コンポーネント構造（アトミックデザイン）
- `app/components/molecules/` - DesktopIcon
- `app/components/organisms/` - Window（ウィンドウのchrome）、MenuBar
- `app/components/organisms/windows/` - 各ウィンドウの中身
- `app/components/templates/` - Desktop（デスクトップ全体の組み立て）
- `app/components/pages/` - ルートごとの薄いラッパー（開くウィンドウの指定のみ）

### ルーティング
`app/routes/`内のファイルベースルーティング。全ルートが同じDesktopを描画し、初期状態で開くウィンドウだけが異なる：
- `/` - プロフィール + ターミナル
- `/products` - productsフォルダ
- `/accounts` - ネットワーク環境設定
- `_renderer.tsx` - メインHTMLラッパーとSEOメタ（各ルートのjsonLd/descriptionは維持すること）
- `_404.tsx` / `_error.tsx` - OS風のシステムエラーダイアログ

### クライアントサイド（app/client/os.ts）
- ウィンドウ管理：ドラッグ（768px以上のみ）、フォーカス（z-index）、開閉（`data-open`/`data-close`属性）
- 起動画面（セッションごとに1回）、メニューバーの時計
- ターミナルのコマンド実行
- 右クリックでOS風コンテキストメニュー（壁紙切替・ウィンドウ整列・再起動）
- 壁紙はlocalStorage、起動フラグはsessionStorageに保存

### ストレージ
- **Cloudflare KV**: 訪問者カウンター用のキーバリューストレージ（`KV`バインディング、キー`VISITORS_COUNT`）
  - メニューバーに「N人がログイン中」として表示

### 環境バインディング
```typescript
type Bindings = {
  KV: KVNamespace;    // 訪問者カウンターストレージ
}
```

## デザインガイドライン
tomokiOSの世界観を維持：
- パステルカラー（ラベンダー地 #b9b2e6、インク #201d33、黄/桃/緑/青のタイトルバー）
- 2pxのインク色ボーダー + ハードシャドウ（ぼかしなし）でピクセル感を統一
- UIクロームは等幅フォント、本文はゴシック体
- 遊び心はコピーで出す（「640KBあればじゅうぶん」「素通り禁止」等）。新しい要素にも必ず小ネタを仕込むこと
- モバイル（<768px）ではウィンドウは縦積み・ドラッグ無効
- レスポンシブとアクセシビリティ（aria属性、フォーカスリング、prefers-reduced-motion）は維持
