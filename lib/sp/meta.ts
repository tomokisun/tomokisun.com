// SPアプリのメタ情報（スイッチャーのカード表示・ジグル編集の削除拒否芸で使う）

export type SpAppMeta = {
  label: string
  icon: string
  color: string
  /** ×バッジで削除しようとしたときの拒否理由 */
  removeRefusal: string
}

export const SP_APPS: Record<string, SpAppMeta> = {
  profile: {
    label: 'プロフィール',
    icon: '📝',
    color: 'cherry',
    removeRefusal: '本人ごと消えるためキャンセルされました',
  },
  products: {
    label: 'Products',
    icon: '📁',
    color: 'melon',
    removeRefusal: 'これで食べているので消せません',
  },
  social: {
    label: 'ソーシャル',
    icon: '🌐',
    color: 'soda',
    removeRefusal: 'つながりは消せません（技術的に）',
  },
  blog: {
    label: 'ブログ',
    icon: '📰',
    color: 'cherry',
    removeRefusal: 'まだ1記事しかないのに',
  },
  settings: {
    label: '設定',
    icon: '⚙️',
    color: 'cream',
    removeRefusal: '設定を消すと二度と設定できません',
  },
  trash: {
    label: 'ゴミ箱',
    icon: '🗑',
    color: 'lavender',
    removeRefusal: 'ゴミ箱をゴミ箱に入れることはできません',
  },
  'terminal-blocked': {
    label: 'ターミナル',
    icon: '＞_',
    color: 'dark',
    removeRefusal: '', // ターミナルだけは削除に成功する（そして戻ってくる）
  },
}

/** ホーム画面のラベル文字列 → アプリID（グッズ等の外部リンクはID無し） */
export function appIdFromLabel(label: string): string | null {
  for (const [id, meta] of Object.entries(SP_APPS)) {
    if (meta.label === label) return id
  }
  return null
}
