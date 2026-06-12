import { ALL_CONSTITUTIONS } from '@/data/constitutions'

/** 不調チェック項目（鍼灸師監修済みの physicalTraits を元データとする） */
export type SymptomItem = {
  /** 一意なID（constitutionId と連番から生成） */
  id: string
  /** チェック項目の文言 */
  label: string
  /** 対応する体質タイプの id */
  constitutionId: string
}

/**
 * 全体質タイプの physicalTraits からチェックリストを生成する。
 * 知識ベース（監修対象）を唯一の出典とし、UI側で文言を二重管理しない。
 */
export const SYMPTOM_ITEMS: readonly SymptomItem[] = ALL_CONSTITUTIONS.flatMap((c) =>
  c.physicalTraits.map((label, i) => ({
    id: `${c.id}-${i}`,
    label,
    constitutionId: c.id,
  }))
)

/** チェックされた症状IDから、体質タイプごとの該当数を集計する */
export function countSymptomsByConstitution(checkedIds: readonly string[]): Map<string, number> {
  const checked = new Set(checkedIds)
  const counts = new Map<string, number>()
  for (const item of SYMPTOM_ITEMS) {
    if (checked.has(item.id)) {
      counts.set(item.constitutionId, (counts.get(item.constitutionId) ?? 0) + 1)
    }
  }
  return counts
}
