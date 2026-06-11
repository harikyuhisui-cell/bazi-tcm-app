import type { Element } from '@/types/wuxing'

/** スコアリングルール */
export const SCORE_RULES = {
  /** 天干 1本あたり */
  stem: 1.0,
  /** 地支本気（蔵干の1番目） */
  branchPrincipal: 1.0,
  /** 蔵干中気（2番目） */
  hiddenMiddle: 0.5,
  /** 蔵干余気（3番目） */
  hiddenResidual: 0.3,
  /** 月令を得ている場合の日干へのボーナス */
  monthlyCommandBonus: 1.5,
} as const

/**
 * 身強・身弱の判定しきい値。
 * 日主を支える力（日主自身＋日主を生じる五行）の全体に対する比率で判定する。
 */
export const STRENGTH_THRESHOLDS = {
  /** この比率以上なら身強 */
  strong: 0.45,
  /** この比率以下なら身弱 */
  weak: 0.3,
} as const

/** 相生（生じる側 → 生じられる側）: 木生火, 火生土, 土生金, 金生水, 水生木 */
export const GENERATES: Record<Element, Element> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
}

/** 相剋（剋す側 → 剋される側）: 木剋土, 土剋水, 水剋火, 火剋金, 金剋木 */
export const CONTROLS: Record<Element, Element> = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木',
}

/** 五行 → 五臓の対応 */
export const ELEMENT_TO_ORGAN: Record<Element, string> = {
  木: '肝',
  火: '心',
  土: '脾',
  金: '肺',
  水: '腎',
}

/** ある五行を生じる側の五行（GENERATES の逆引き） */
export function generatedBy(element: Element): Element {
  const entry = (Object.entries(GENERATES) as [Element, Element][]).find(
    ([, to]) => to === element
  )
  // GENERATES は全五行を網羅する循環なので必ず見つかる
  return entry![0]
}
