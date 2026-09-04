// ディープリンク: URLからOSのどのアプリを起動するかだけを表す。
//
// 【根幹ルール】このサイトに「OSの外のページ」は存在しない。
// /blog/<slug> のような共有用URLも、独立したページを描くのではなく
// 「OSを起動して、そのアプリをその状態で開く」ためのリンクとして扱う。

export type DeepLink = {
  /** 起動するアプリ／ウィンドウのID（例: 'blog'） */
  app: string
  /** アプリの中で開く項目（例: ブログのslug） */
  item?: string
}

/** PCで最初から開いておくウィンドウID（サーバー側で is-open を付けてチラつきを防ぐ） */
export function openWindowIds(link?: DeepLink): string[] {
  if (!link) return []
  return link.item ? [link.app, `${link.app}-${link.item}`] : [link.app]
}
