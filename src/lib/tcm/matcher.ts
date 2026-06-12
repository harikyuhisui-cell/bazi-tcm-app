import type { BaziResult } from '@/types/bazi'
import type { WuxingAnalysis, Element } from '@/types/wuxing'
import type { ConstitutionMatch, DiagnosisResult } from '@/types/tcm'
import { ELEMENT_TO_ORGAN } from '@/lib/wuxing/rules'
import { getConstitutionById } from '@/data/constitutions'
import { MAPPING_RULES, FALLBACK_BY_WEAKEST_ELEMENT } from './mappingRules'
import { countSymptomsByConstitution } from './symptoms'

/** チェックされた不調1件あたりの加点 */
const SYMPTOM_POINT = 1

/**
 * 五行バランス分析から体質タイプの傾向を推定する。
 *
 * 各マッピングルールを評価し、該当したルールのポイントを体質タイプごとに合算。
 * 不調チェック（任意）が渡された場合は、該当する体質タイプに自覚症状を加点する。
 * スコア上位（最大2件）を候補として返す。どのルールにも該当しない場合は、
 * 最弱の五行に対応する体質タイプをフォールバックとして返す。
 *
 * @param analysis Phase 2 の analyzeWuxing の出力
 * @param checkedSymptomIds ユーザーがチェックした不調項目のID（任意）
 * @returns スコア降順の体質タイプ候補（1〜2件、根拠つき）
 */
export function matchConstitutions(
  analysis: WuxingAnalysis,
  checkedSymptomIds: readonly string[] = []
): ConstitutionMatch[] {
  const byId = new Map<string, ConstitutionMatch>()

  const getEntry = (constitutionId: string): ConstitutionMatch => {
    const entry = byId.get(constitutionId) ?? { constitutionId, score: 0, reasons: [] }
    byId.set(constitutionId, entry)
    return entry
  }

  for (const rule of MAPPING_RULES) {
    if (!rule.matches(analysis)) continue
    const entry = getEntry(rule.constitutionId)
    entry.score += rule.points
    entry.reasons.push(rule.reason)
  }

  // 自覚症状の加点（命式由来の傾向に、本人のチェックを上乗せする）
  Array.from(countSymptomsByConstitution(checkedSymptomIds)).forEach(([constitutionId, count]) => {
    const entry = getEntry(constitutionId)
    entry.score += count * SYMPTOM_POINT
    entry.reasons.push(`気になる不調として${count}件の項目が当てはまっています`)
  })

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
export function buildDiagnosis(
  bazi: BaziResult,
  wuxing: WuxingAnalysis,
  checkedSymptomIds: readonly string[] = []
): DiagnosisResult {
  const matches = matchConstitutions(wuxing, checkedSymptomIds)

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
