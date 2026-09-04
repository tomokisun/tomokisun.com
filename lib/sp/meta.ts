// SPアプリのメタ情報。data/apps.ts から導出し、SP専用の疑似アプリだけ手で足す。
// （スイッチャーのカード表示・ジグル編集の削除拒否芸で使う）

import { spApps } from '@/data/apps'

export type SpAppMeta = {
  label: string
  icon: string
  color: string
  /** ×バッジで削除しようとしたときの拒否理由 */
  removeRefusal: string
}

const registry: Record<string, SpAppMeta> = {}
for (const app of spApps) {
  registry[app.id] = {
    label: app.name,
    icon: app.icon,
    color: app.color,
    removeRefusal: app.removeRefusal ?? 'このAppは削除できません（なんとなく）',
  }
}

// ターミナルはSPに存在しない。スイッチャーに「応答なし」で常駐し、削除だけは成功する（そして戻る）
registry['terminal-blocked'] = {
  label: 'ターミナル',
  icon: '＞_',
  color: 'dark',
  removeRefusal: '',
}

export const SP_APPS: Record<string, SpAppMeta> = registry

/** ホーム画面のラベル文字列 → アプリID（外部リンクのアイコンはIDを持たない） */
export function appIdFromLabel(label: string): string | null {
  for (const [id, meta] of Object.entries(SP_APPS)) {
    if (meta.label === label) return id
  }
  return null
}
