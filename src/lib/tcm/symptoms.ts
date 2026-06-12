import { ALL_CONSTITUTIONS } from '@/data/constitutions'
import { filterByGender, type Gender } from './gender'

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

/** 性別に応じて表示する症状項目（男性は婦人科系を除外） */
export function visibleSymptomItems(gender: Gender): SymptomItem[] {
  return filterByGender(SYMPTOM_ITEMS, gender, (s) => s.label)
}

/** 性別に応じて、選択済みの症状IDから非表示になる項目を取り除く */
export function pruneSymptomIdsByGender(checkedIds: readonly string[], gender: Gender): string[] {
  const visible = new Set(visibleSymptomItems(gender).map((s) => s.id))
  return checkedIds.filter((id) => visible.has(id))
}

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
