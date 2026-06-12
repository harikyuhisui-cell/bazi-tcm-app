import type { Element } from '@/types/wuxing'
import { ELEMENT_TO_ORGAN } from './rules'

/** 五行ごとの表示スタイル（色・対応する五臓） */
export const ELEMENT_STYLE: Record<Element, { color: string; organ: string }> = {
  木: { color: '#4e8a4e', organ: ELEMENT_TO_ORGAN['木'] },
  火: { color: '#c0563f', organ: ELEMENT_TO_ORGAN['火'] },
  土: { color: '#a9823a', organ: ELEMENT_TO_ORGAN['土'] },
  金: { color: '#6b7f99', organ: ELEMENT_TO_ORGAN['金'] },
  水: { color: '#3a6ea5', organ: ELEMENT_TO_ORGAN['水'] },
}

/** レーダー／一覧の表示順 */
export const ELEMENT_ORDER: readonly Element[] = ['木', '火', '土', '金', '水'] as const

/** 五行色体表（五臓・五腑・五志・五季・五味・五体）に基づく対応 */
export const ELEMENT_CORRESPONDENCE: Record<
  Element,
  { organ: string; bowel: string; emotion: string; season: string; taste: string; body: string }
> = {
  木: { organ: '肝', bowel: '胆', emotion: '怒', season: '春', taste: '酸', body: '筋・目' },
  火: { organ: '心', bowel: '小腸', emotion: '喜', season: '夏', taste: '苦', body: '血脈・舌' },
  土: { organ: '脾', bowel: '胃', emotion: '思', season: '土用', taste: '甘', body: '肌肉・口' },
  金: { organ: '肺', bowel: '大腸', emotion: '悲', season: '秋', taste: '辛', body: '皮毛・鼻' },
  水: { organ: '腎', bowel: '膀胱', emotion: '恐', season: '冬', taste: '鹹', body: '骨・耳' },
}

/**
 * 五行スコアの全体比率から五臓の状態を表示用に分類する。
 * ※判定（喜神/忌神・身強身弱）とは別の、表示専用のしきい値。
 *   均等配分（20%）を基準に、明らかに高い／低い五行を強調する。
 */
export type OrganStatus = 'excess' | 'normal' | 'deficient'

export const ORGAN_STATUS_THRESHOLDS = {
  excess: 0.25,
  deficient: 0.17,
} as const

export function organStatusOf(ratio: number): OrganStatus {
  if (ratio >= ORGAN_STATUS_THRESHOLDS.excess) return 'excess'
  if (ratio <= ORGAN_STATUS_THRESHOLDS.deficient) return 'deficient'
  return 'normal'
}
