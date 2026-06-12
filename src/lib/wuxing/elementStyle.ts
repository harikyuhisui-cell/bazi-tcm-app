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
