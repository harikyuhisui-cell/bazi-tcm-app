import type { BaziResult } from '@/types/bazi'
import type { HeavenlyStem, EarthlyBranch } from '@/types/bazi'
import type { Element, BodyStrength, WuxingAnalysis } from '@/types/wuxing'
import { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, HIDDEN_STEMS } from '@/lib/bazi/constants'
import {
  SCORE_RULES,
  STRENGTH_THRESHOLDS,
  GENERATES,
  CONTROLS,
  ELEMENT_TO_ORGAN,
  generatedBy,
} from './rules'

const ELEMENTS: readonly Element[] = ['木', '火', '土', '金', '水'] as const

/**
 * 命式から五行バランスを分析する。
 *
 * スコアリング:
 * - 天干 1.0点 / 地支本気 1.0点 / 蔵干中気 0.5点 / 蔵干余気 0.3点
 * - 月令を得ている（日干の五行＝月支本気の五行）場合、日干の五行に +1.5点
 *
 * 身強・身弱:
 * - 日主を支える力（日主と同じ五行＋日主を生じる五行）の比率で判定
 *
 * @param bazi Phase 1 の calculateBazi の出力
 * @returns 五行スコア・強弱判定・喜神/忌神・五臓対応を含む分析結果
 */
export function analyzeWuxing(bazi: BaziResult): WuxingAnalysis {
  const scores = calculateScores(bazi)
  const dayMasterElement = STEM_TO_ELEMENT[bazi.dayMaster as HeavenlyStem]

  const strength = judgeStrength(scores, dayMasterElement)
  const { favorable, unfavorable } = judgeFavorableElements(scores, dayMasterElement, strength)

  const dominant = maxElement(scores)
  const weakest = minElement(scores)

  return {
    scores,
    dayMasterElement,
    strength,
    favorableElements: favorable,
    unfavorableElements: unfavorable,
    dominantOrgan: ELEMENT_TO_ORGAN[dominant],
    weakestOrgan: ELEMENT_TO_ORGAN[weakest],
    explanation: buildExplanation(scores, dayMasterElement, strength, favorable, unfavorable),
  }
}

/**
 * 四柱の天干・蔵干から五行スコアを集計する。
 * 地支は本気（蔵干1番目）1.0点・中気0.5点・余気0.3点として数える。
 */
function calculateScores(bazi: BaziResult): Record<Element, number> {
  const scores: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour]

  const hiddenWeights = [
    SCORE_RULES.branchPrincipal,
    SCORE_RULES.hiddenMiddle,
    SCORE_RULES.hiddenResidual,
  ]

  for (const pillar of pillars) {
    scores[STEM_TO_ELEMENT[pillar.stem as HeavenlyStem]] += SCORE_RULES.stem
    const hidden = HIDDEN_STEMS[pillar.branch as EarthlyBranch]
    hidden.forEach((stem, i) => {
      scores[STEM_TO_ELEMENT[stem]] += hiddenWeights[i]
    })
  }

  // 月令: 日干の五行が月支本気の五行と一致する場合にボーナス
  const dayMasterElement = STEM_TO_ELEMENT[bazi.day.stem as HeavenlyStem]
  const monthElement = BRANCH_TO_ELEMENT[bazi.month.branch as EarthlyBranch]
  if (dayMasterElement === monthElement) {
    scores[dayMasterElement] += SCORE_RULES.monthlyCommandBonus
  }

  // 浮動小数点の桁を丸める
  for (const el of ELEMENTS) {
    scores[el] = Math.round(scores[el] * 10) / 10
  }
  return scores
}

/**
 * 日主の強弱を判定する。
 * 支持率 = (日主の五行 + 日主を生じる五行) / 全体スコア
 */
function judgeStrength(scores: Record<Element, number>, dayMaster: Element): BodyStrength {
  const total = ELEMENTS.reduce((sum, el) => sum + scores[el], 0)
  const support = scores[dayMaster] + scores[generatedBy(dayMaster)]
  const ratio = support / total

  if (ratio >= STRENGTH_THRESHOLDS.strong) return '身強'
  if (ratio <= STRENGTH_THRESHOLDS.weak) return '身弱'
  return '中和'
}

/**
 * 喜神・忌神を判定する。
 * - 身強: 日主の力を漏らす・抑える五行（食傷・財・官）が喜神、強める五行（比劫・印）が忌神
 * - 身弱: 日主を強める五行（比劫・印）が喜神、消耗させる五行が忌神
 * - 中和: 最も弱い五行を補うことを喜とし、最も強い五行の過剰を忌とする
 */
function judgeFavorableElements(
  scores: Record<Element, number>,
  dayMaster: Element,
  strength: BodyStrength
): { favorable: Element[]; unfavorable: Element[] } {
  const self = dayMaster
  const resource = generatedBy(self) // 印: 日主を生じる
  const output = GENERATES[self] // 食傷: 日主が生じる
  const wealth = CONTROLS[self] // 財: 日主が剋す
  const officer = ELEMENTS.find((el) => CONTROLS[el] === self)! // 官: 日主を剋す

  if (strength === '身強') {
    return { favorable: [output, wealth, officer], unfavorable: [self, resource] }
  }
  if (strength === '身弱') {
    return { favorable: [self, resource], unfavorable: [officer, wealth, output] }
  }
  // 中和: 偏りの是正を優先
  return { favorable: [minElement(scores)], unfavorable: [maxElement(scores)] }
}

/** 最高スコアの五行を返す（同点時は木火土金水の順で先のもの） */
function maxElement(scores: Record<Element, number>): Element {
  return ELEMENTS.reduce((a, b) => (scores[b] > scores[a] ? b : a))
}

/** 最低スコアの五行を返す（同点時は木火土金水の順で先のもの） */
function minElement(scores: Record<Element, number>): Element {
  return ELEMENTS.reduce((a, b) => (scores[b] < scores[a] ? b : a))
}

/**
 * 判定根拠の説明文を生成する。
 * 医療行為と誤解されないよう、傾向・参考としての表現に留める。
 */
function buildExplanation(
  scores: Record<Element, number>,
  dayMaster: Element,
  strength: BodyStrength,
  favorable: Element[],
  unfavorable: Element[]
): string {
  const dominant = maxElement(scores)
  const weakest = minElement(scores)
  const scoreText = ELEMENTS.map((el) => `${el}${scores[el]}`).join('・')

  return (
    `五行スコアは ${scoreText} です。` +
    `日主は${dayMaster}の気で、命式全体では「${strength}」の傾向が見られます。` +
    `${dominant}の気が比較的強く（五臓では${ELEMENT_TO_ORGAN[dominant]}に対応）、` +
    `${weakest}の気が比較的弱い（同じく${ELEMENT_TO_ORGAN[weakest]}に対応）配置です。` +
    `バランスの観点では、${favorable.join('・')}の気を補うことが好ましく、` +
    `${unfavorable.join('・')}の気の過剰には注意が必要とされています。` +
    `※本結果は東洋医学・占術の考え方に基づく参考情報であり、医療診断ではありません。`
  )
}
