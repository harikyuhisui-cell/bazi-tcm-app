/**
 * 遺伝性体質チェックリスト（血縁者の体質傾向）。
 *
 * ※遺伝・発症を断定するものではなく、「血縁者に多い体質傾向は、東洋医学的にも
 *   近い傾向が現れやすい」という考え方に基づく参考情報。各項目を体質タイプの
 *   傾向にゆるやかに対応づけ、命式・自覚症状の判定に加味する。
 */
export type FamilyHistoryItem = {
  id: string
  /** チェック項目の文言 */
  label: string
  /** 関連する体質タイプの id（複数可） */
  constitutionIds: readonly string[]
}

export const FAMILY_HISTORY_ITEMS: readonly FamilyHistoryItem[] = [
  {
    id: 'allergy',
    label: '血縁者にアレルギー体質（花粉症・鼻炎）の方がいる',
    constitutionIds: ['lung-qi-deficiency'],
  },
  {
    id: 'asthma',
    label: '血縁者に喘息・気管支が弱い方がいる',
    constitutionIds: ['lung-qi-deficiency'],
  },
  {
    id: 'atopy',
    label: '血縁者にアトピー・皮膚炎の方がいる',
    constitutionIds: ['lung-qi-deficiency', 'spleen-deficiency'],
  },
  {
    id: 'hypertension',
    label: '血縁者に高血圧の方がいる',
    constitutionIds: ['phlegm-blood-stasis', 'liver-qi-stagnation'],
  },
  {
    id: 'heart',
    label: '血縁者に心臓病・動悸・不整脈の方がいる',
    constitutionIds: ['heart-fire', 'phlegm-blood-stasis'],
  },
  {
    id: 'stroke',
    label: '血縁者に脳卒中・血管系の不調の方がいる',
    constitutionIds: ['phlegm-blood-stasis'],
  },
  {
    id: 'diabetes',
    label: '血縁者に糖尿病の方がいる',
    constitutionIds: ['spleen-deficiency', 'kidney-yin-deficiency'],
  },
  {
    id: 'stomach',
    label: '血縁者に胃腸が弱い方がいる',
    constitutionIds: ['spleen-deficiency'],
  },
  {
    id: 'anemia',
    label: '血縁者に貧血気味の方がいる',
    constitutionIds: ['qi-blood-deficiency'],
  },
  {
    id: 'coldness',
    label: '血縁者に冷え性・低血圧の方がいる',
    constitutionIds: ['kidney-yang-deficiency', 'qi-blood-deficiency'],
  },
  {
    id: 'kidney',
    label: '血縁者に腎臓・むくみ・泌尿器の不調の方がいる',
    constitutionIds: ['kidney-yang-deficiency', 'kidney-yin-deficiency'],
  },
  {
    id: 'autonomic',
    label: '血縁者に気分の浮き沈み・自律神経の不調の方がいる',
    constitutionIds: ['liver-qi-stagnation'],
  },
  {
    id: 'insomnia',
    label: '血縁者に不眠・神経が高ぶりやすい方がいる',
    constitutionIds: ['heart-fire'],
  },
  {
    id: 'joints',
    label: '血縁者に関節・骨が弱い方がいる',
    constitutionIds: ['kidney-yin-deficiency', 'kidney-yang-deficiency'],
  },
  {
    id: 'headache',
    label: '血縁者に頭痛・強い肩こりの方がいる',
    constitutionIds: ['liver-qi-stagnation'],
  },
]

/** チェックされた家族歴IDから、体質タイプごとの該当数を集計する */
export function countFamilyByConstitution(checkedIds: readonly string[]): Map<string, number> {
  const checked = new Set(checkedIds)
  const counts = new Map<string, number>()
  for (const item of FAMILY_HISTORY_ITEMS) {
    if (!checked.has(item.id)) continue
    for (const cid of item.constitutionIds) {
      counts.set(cid, (counts.get(cid) ?? 0) + 1)
    }
  }
  return counts
}
