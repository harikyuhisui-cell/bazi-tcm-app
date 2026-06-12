import type { BaziResult } from '@/types/bazi'
import type { WuxingAnalysis, Element } from '@/types/wuxing'
import type { ConstitutionMatch, DiagnosisResult } from '@/types/tcm'
import { ELEMENT_TO_ORGAN } from '@/lib/wuxing/rules'
import { getConstitutionById } from '@/data/constitutions'
import { MAPPING_RULES, FALLBACK_BY_WEAKEST_ELEMENT } from './mappingRules'

/**
 * 五行バランス分析から体質タイプの傾向を推定する。
 *
 * 各マッピングルールを評価し、該当したルールのポイントを体質タイプごとに合算。
 * スコア上位（最大2件）を候補として返す。どのルールにも該当しない場合は、
 * 最弱の五行に対応する体質タイプをフォールバックとして返す。
 *
 * @param analysis Phase 2 の analyzeWuxing の出力
 * @returns スコア降順の体質タイプ候補（1〜2件、根拠つき）
 */
export function matchConstitutions(analysis: WuxingAnalysis): ConstitutionMatch[] {
  const byId = new Map<string, ConstitutionMatch>()

  for (const rule of MAPPING_RULES) {
    if (!rule.matches(analysis)) continue
    const entry = byId.get(rule.constitutionId) ?? {
      constitutionId: rule.constitutionId,
      score: 0,
      reasons: [],
    }
    entry.score += rule.points
    entry.reasons.push(rule.reason)
    byId.set(rule.constitutionId, entry)
  }

  let matches = Array.from(byId.values()).sort((a, b) => b.score - a.score)

  if (matches.length === 0) {
    const weakest = weakestElement(analysis)
    matches = [
      {
        constitutionId: FALLBACK_BY_WEAKEST_ELEMENT[weakest],
        score: 1,
        reasons: [
          `五行の偏りは大きくありませんが、相対的に${weakest}（${ELEMENT_TO_ORGAN[weakest]}）の気がやや弱い配置です`,
        ],
      },
    ]
  }

  return matches.slice(0, 2)
}

/**
 * 命式・五行分析・体質マッチをまとめた最終結果を組み立てる。
 *
 * @throws マッチした constitutionId が知識ベースに存在しない場合（実装バグ検知用）
 */
export function buildDiagnosis(bazi: BaziResult, wuxing: WuxingAnalysis): DiagnosisResult {
  const matches = matchConstitutions(wuxing)

  const primary = getConstitutionById(matches[0].constitutionId)
  if (!primary) {
    throw new Error(`未登録の体質タイプ id: ${matches[0].constitutionId}`)
  }
  const secondary = matches[1] ? getConstitutionById(matches[1].constitutionId) : undefined

  return {
    bazi,
    wuxing,
    matches,
    primaryConstitution: primary,
    secondaryConstitution: secondary,
  }
}

/** 最低スコアの五行を返す */
function weakestElement(analysis: WuxingAnalysis): Element {
  const elements = Object.keys(analysis.scores) as Element[]
  return elements.reduce((a, b) => (analysis.scores[b] < analysis.scores[a] ? b : a))
}
