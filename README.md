# tomokisun.com - 90年代スタイルのウェブサイト

このプロジェクトはtomokisun.comの90年代スタイルのウェブサイトで、1990年代のウェブデザイン要素を特徴としています。HonoX、Vite、Bunを使用して構築され、Cloudflare Workersにデプロイされています。

## 技術スタック

- **Bun**: JavaScriptランタイムおよびパッケージマネージャー
- **Vite**: ビルドツールおよび開発サーバー
- **Hono/HonoX**: Webフレームワーク（JSXレンダリングを使用）
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **Cloudflare Workers**: デプロイメントプラットフォーム
- **Cloudflare KV**: 訪問者カウンターなどのデータ保存に使用

## 特徴

- テーブルベースのレイアウト（90年代の標準）
- 明るく対照的な色使い
- Comic Sansなどの当時人気だったフォント
- アニメーション要素（点滅するテキスト、マーキー）
- 訪問者カウンター（Cloudflare KVを使用）
- 「常に工事中」の通知
- ゲストブック機能
- カスタムマウスカーソルとトレイルエフェクト
- レスポンシブデザイン（モバイル対応）
- 虹色の区切り線
- キリ番通知機能

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
│   ├── global.d.ts        # グローバル型定義
│   ├── components/        # 再利用可能なコンポーネント
│   │   ├── atoms/         # 基本的なUIコンポーネント
│   │   ├── molecules/     # 複合的なUIコンポーネント
│   │   ├── organisms/     # 複雑なUIコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   └── templates/     # テンプレートコンポーネント
│   ├── islands/           # インタラクティブなコンポーネント
│   │   ├── Guestbook.tsx  # ゲストブックコンポーネント
│   │   └── GuestbookForm.tsx # ゲストブック投稿フォーム
│   ├── routes/            # ページルート
│   │   ├── _404.tsx       # 404エラーページ
│   │   ├── _error.tsx     # エラーページ
│   │   ├── _renderer.tsx  # JSXレンダラー設定
│   │   ├── accounts.tsx   # アカウント一覧ページ
│   │   ├── index.tsx      # ホームページ
│   │   └── products.tsx   # プロダクト一覧ページ
│   └── utils/             # ユーティリティ関数
│       └── visitors.ts    # 訪問者カウンター機能
├── docs/                  # プロジェクトドキュメント
│   └── tone-and-manner.md # デザインガイドライン
├── public/                # 静的アセット
│   ├── .assetsignore      # アセット除外設定
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

### 開発サーバーの起動

```bash
# 開発サーバーの起動
bun run dev
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

サイトには訪問者カウンター機能が実装されています。これはCloudflare KVを使用して訪問者数を保存・表示します。実装は`app/utils/visitors.ts`にあります：

```typescript
export async function incrementVisitorsCount(c: Context<Env, any, {}>) {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }
  return visitorsCount;
}
```

この機能はルートハンドラー（`app/routes/index.tsx`）で呼び出されています：

```typescript
export default createRoute(async (c) => {
  await incrementVisitorsCount(c);
  return c.render(<HomePage c={c} />)
})
```

### ゲストブック

サイトには90年代風のゲストブック機能があり、訪問者がメッセージを残すことができます。この機能は`app/islands/Guestbook.tsx`と`app/islands/GuestbookForm.tsx`で実装されています。ゲストブックはタブ形式で「カキコする」と「メッセージを読む」の2つのセクションに分かれています。

```typescript
// Guestbook.tsx
export default function Guestbook({ className = '' }: GuestbookProps) {
  const [activeTab, setActiveTab] = useState(0)

  // タブをクリックしたときの処理
  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className={`guestbook ${className}`}>
      <div className="guestbook-header">
        <span className="guestbook-icon">📝</span>
        掲示板
        <span className="guestbook-icon">📝</span>
      </div>
      
      <div className="guestbook-tabs">
        <Tab 
          label="カキコする"
          isActive={activeTab === 0}
          onClick={() => handleTabClick(0)}
        />
        <Tab 
          label="メッセージを読む"
          isActive={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
      </div>
      
      <div className="guestbook-content">
        {activeTab === 0 ? (
          <GuestbookForm />
        ) : (
          <GuestbookList />
        )}
      </div>
    </div>
  )
}
```

### マウストレイルエフェクト

サイトには90年代風のマウストレイルエフェクトが実装されています。このエフェクトは`app/routes/_renderer.tsx`内のJavaScriptで実装されており、マウスの動きに合わせて小さな光の粒子が表示されます。

```javascript
// Track mouse movement and create trail elements
document.addEventListener('mousemove', function(e) {
  // Skip trail creation if mouse is inside container
  if (isInsideContainer(e)) return;
  
  // Throttle the creation of trail elements (every 50ms)
  if (!this.throttleTimeout) {
    this.throttleTimeout = setTimeout(() => {
      createTrailElement(e.clientX, e.clientY);
      this.throttleTimeout = null;
    }, 50);
  }
});
```

また、クリック時にも特殊なエフェクトが表示されます：

```javascript
// Add click effect
document.addEventListener('click', function(e) {
  // Skip click effect if inside container
  if (isInsideContainer(e)) return;
  
  // Create multiple particles for click effect
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      
      // Random position around click point
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30;
      const x = e.clientX + Math.cos(angle) * distance;
      const y = e.clientY + Math.sin(angle) * distance;
      
      trail.style.left = x + 'px';
      trail.style.top = y + 'px';
      body.appendChild(trail);
      
      setTimeout(() => {
        trail.remove();
      }, 1000);
    }, i * 50);
  }
});
```

### レスポンシブデザイン

90年代のウェブサイトはレスポンシブではありませんでしたが、このプロジェクトではモバイルデバイスでの表示も考慮しています。CSSメディアクエリを使用して、小さな画面サイズでもコンテンツが適切に表示されるようにしています。

```css
/* Responsive styles */
@media (max-width: 768px) {
  body {
    padding: 10px 0;
  }
  
  .container table {
    width: 100% !important;
  }
  
  .container td {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
  }
  
  .sidebar {
    margin-bottom: 15px;
  }
  
  .menu-item {
    padding: 10px 5px;
    margin: 8px 0;
  }
  
  .section-header, .guestbook-header {
    padding: 8px 5px;
  }
  
  .form-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 8px;
    font-size: 16px; /* Prevents iOS zoom on focus */
    border-radius: 0; /* Prevents iOS from adding rounded corners */
    -webkit-appearance: none; /* Removes default iOS styling */
  }
  
  textarea.form-input {
    min-height: 100px;
    resize: vertical;
  }
  
  .submit-button {
    padding: 10px;
    width: 100%;
    margin: 15px 0 5px;
  }
  
  h1 {
    font-size: 1.5em;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  body {
    padding: 5px 0;
  }
  
  h1 {
    font-size: 1.2em;
  }
  
  .section-content, .guestbook-content {
    padding: 8px;
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
10. **キリ番通知**：訪問者数が特定の数値に達した際の通知
11. **カスタムマウスカーソル**：独自のカーソルデザイン
12. **虹色の区切り線**：セクション間の区切りに使用される虹色の水平線

## コンポーネント構造

このプロジェクトはAtomicデザインパターンに基づいてコンポーネントを構造化しています：

- **Atoms**: 最も基本的なUIコンポーネント（Button、Heading、Input、Link、Text、TextAreaなど）
- **Molecules**: 複数のAtomsを組み合わせた複合コンポーネント（FormField、GuestbookEntry、MenuItemなど）
- **Organisms**: 複数のMoleculesを組み合わせた複雑なコンポーネント（Footer、GuestbookList、Header、Menuなど）
- **Templates**: ページのレイアウト構造を定義するコンポーネント（PageLayout）
- **Pages**: 実際のページコンテンツを表示するコンポーネント（HomePage、AccountsPage、ProductsPageなど）

## トーンアンドマナー

プロジェクトには`docs/tone-and-manner.md`ファイルが含まれており、サイトのデザイン哲学、ビジュアル要素、コンテンツトーン、ユーザー体験に関する詳細なガイドラインが記載されています。このドキュメントは、サイトの一貫性を保ちながら開発を進めるための参考資料として使用できます。

主なデザイン哲学は以下の通りです：

- **意図的なレトロ感**: 現代のウェブデザイン慣行に反して、初期のウェブの美学を称えるデザイン
- **「工事中」の永続性**: 「Always Under Construction」というフレーズで表現される、完成しない魅力
- **技術的な素朴さ**: 複雑なJavaScriptやCSSエフェクトを最小限に抑え、HTMLの基本に忠実

## ライセンス

© 2025 tomokisun
