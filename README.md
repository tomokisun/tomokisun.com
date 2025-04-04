# tomokisun.com - 90年代スタイルのウェブサイト

このプロジェクトはtomokisun.comの90年代スタイルのウェブサイトで、1990年代のウェブデザイン要素を特徴としています。HonoX、Vite、Bunを使用して構築され、Cloudflare Workersにデプロイされています。

## 技術スタック

- **Bun**: JavaScriptランタイムおよびパッケージマネージャー
- **Vite**: ビルドツールおよび開発サーバー
- **Hono/HonoX**: Webフレームワーク（JSXレンダリングを使用）
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **Cloudflare Workers**: デプロイメントプラットフォーム

## 特徴

- テーブルベースのレイアウト（90年代の標準）
- 明るく対照的な色使い
- Comic Sansなどの当時人気だったフォント
- アニメーション要素（点滅するテキスト、マーキー）
- 訪問者カウンター（Cloudflare KVを使用）
- 「工事中」の通知
- ゲストブック機能
- カスタムマウスカーソルとトレイルエフェクト
- レスポンシブデザイン（モバイル対応）

## プロジェクトの実行

ローカルでプロジェクトを実行するには：

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

その後、ブラウザでhttp://localhost:5173/を開きます

## プロジェクト構造

```
tomokisun.com/
├── app/                   # アプリケーションのソースコード
│   ├── client.ts          # クライアントサイドのエントリーポイント
│   ├── server.ts          # サーバーサイドのエントリーポイント
│   ├── style.css          # グローバルスタイル（Tailwind CSSを含む）
│   ├── components/        # 再利用可能なコンポーネント
│   │   └── menu.tsx       # サイドバーメニューコンポーネント
│   ├── islands/           # インタラクティブなコンポーネント
│   │   ├── counter.tsx    # カウンターコンポーネント
│   │   └── guestbook.tsx  # ゲストブックコンポーネント
│   └── routes/            # ページルート
│       ├── _404.tsx       # 404エラーページ
│       ├── _error.tsx     # エラーページ
│       ├── _renderer.tsx  # JSXレンダラー設定
│       ├── accounts.tsx   # アカウント一覧ページ
│       ├── index.tsx      # ホームページ
│       └── products.tsx   # プロダクト一覧ページ
├── docs/                  # プロジェクトドキュメント
│   └── tone-and-manner.md # デザインガイドライン
├── public/                # 静的アセット
│   └── favicon.ico        # ファビコン
├── vite.config.ts         # Vite設定
└── wrangler.jsonc         # Cloudflare Workers設定
```

## 開発ワークフロー

### 依存関係の管理

```bash
# パッケージのインストール
bun install

# 新しいパッケージの追加
bun add [パッケージ名]

# 開発用パッケージの追加
bun add -D [パッケージ名]
```

### ビルドとプレビュー

```bash
# プロジェクトのビルド
bun run build

# ビルド後のプレビュー（Wranglerを使用）
bun run preview
```

### デプロイ

```bash
# Cloudflare Workersへのデプロイ
bun run deploy
```

## 主要機能

### 訪問者カウンター

サイトには訪問者カウンター機能が実装されています。これはCloudflare KVを使用して訪問者数を保存・表示します。サーバーサイドの実装は`app/server.ts`にあります：

```typescript
app.use('/', async (c, next) => {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }
  await next();
})
```

### ゲストブック

サイトには90年代風のゲストブック機能があり、訪問者がメッセージを残すことができます。この機能は`app/islands/guestbook.tsx`で実装されています。

### マウストレイルエフェクト

サイトには90年代風のマウストレイルエフェクトが実装されています。このエフェクトは`app/routes/_renderer.tsx`内のJavaScriptで実装されており、マウスの動きに合わせて小さな光の粒子が表示されます。

```javascript
// マウストレイルエフェクト
document.addEventListener('mousemove', function(e) {
  // マウスの動きに合わせてトレイル要素を作成
  if (!isInsideContainer(e)) {
    createTrailElement(e.clientX, e.clientY);
  }
});
```

### レスポンシブデザイン

90年代のウェブサイトはレスポンシブではありませんでしたが、このプロジェクトではモバイルデバイスでの表示も考慮しています。CSSメディアクエリを使用して、小さな画面サイズでもコンテンツが適切に表示されるようにしています。

```css
/* レスポンシブスタイル */
@media (max-width: 768px) {
  .container table {
    width: 100% !important;
  }
  
  .container td {
    display: block;
    width: 100% !important;
  }
}
```

## 90年代ウェブデザイン要素

このウェブサイトには、90年代ウェブデザインの多くの古典的な要素が組み込まれています：

1. **テーブルベースのレイアウト**：CSSが標準になる前は、テーブルがページレイアウトに使用されていました
2. **明るい色**：鮮やかで、しばしば対照的な配色が一般的でした
3. **点滅するテキスト**：重要な情報を強調するための点滅効果
4. **訪問者カウンター**：サイトの訪問者数を表示
5. **工事中**：「常に工事中」の通知
6. **ゲストブック**：訪問者がメッセージを残すことができる機能
7. **マーキーテキスト**：スクロールするテキスト効果
8. **テクスチャ背景**：タイル状の背景パターン
9. **3Dボタン**：3D効果を作り出すためのベベル加工されたエッジ

## トーンアンドマナー

プロジェクトには`docs/tone-and-manner.md`ファイルが含まれており、サイトのデザイン哲学、ビジュアル要素、コンテンツトーン、ユーザー体験に関する詳細なガイドラインが記載されています。このドキュメントは、サイトの一貫性を保ちながら開発を進めるための参考資料として使用できます。

## ライセンス

© 2025 tomokisun
