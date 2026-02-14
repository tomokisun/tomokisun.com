# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要
HonoX（JSX対応のHonoフレームワーク）で構築された90年代風レトロな個人ウェブサイト。Cloudflare Workers上で動作し、KVストレージを使用。

## 必須コマンド

### 開発
```bash
bun dev              # Viteで開発サーバーを起動
bun run preview      # Wranglerでローカル開発プレビュー
bun run build        # 本番用ビルド（クライアント + サーバー）
bun run deploy       # ビルドしてCloudflare Workersにデプロイ
```

## アーキテクチャと主要パターン

### コンポーネント構造（アトミックデザイン）
- `app/components/atoms/` - 基本的なUI要素（Button、Input、Text）
- `app/components/molecules/` - 複合コンポーネント（FormField）
- `app/components/organisms/` - 複雑なセクション（Header、Footer）
- `app/components/templates/` - ページレイアウト
- `app/components/pages/` - ページ固有のコンポーネント

### ルーティング
`app/routes/`内のファイルベースルーティング：
- `_renderer.tsx` - メインHTMLラッパーとグローバルレイアウト
- `index.tsx` - ホームページのルート
- ルートファイルはHonoアプリインスタンスをデフォルトエクスポート

### ストレージ
- **Cloudflare KV**: 訪問者カウンター用のキーバリューストレージ
  - 本番環境では`VISITORS`バインディングを使用

### スタイリング
- カスタム90年代風テーマのTailwind CSS v4
- グローバルスタイルは`app/style.css`に定義
- レトロエフェクト用のカスタムプロパティを多用

### 環境バインディング
```typescript
type Bindings = {
  VISITORS: KVNamespace;    // 訪問者カウンターストレージ
}
```

## デザインガイドライン
厳格な90年代美学を維持：
- アニメーションGIFと点滅テキスト
- マーキーエフェクト
- レトロな配色とフォント
- マウストレイルエフェクト（クライアントサイド）
- 右クリック防止
- 現代的なレスポンシブデザインとアクセシビリティも維持