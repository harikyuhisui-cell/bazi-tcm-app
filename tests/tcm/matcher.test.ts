import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import { matchConstitutions, buildDiagnosis } from '@/lib/tcm/matcher'
import { ALL_CONSTITUTIONS } from '@/data/constitutions'
import { MAPPING_RULES, FALLBACK_BY_WEAKEST_ELEMENT } from '@/lib/tcm/mappingRules'
import type { WuxingAnalysis } from '@/types/wuxing'

const TZ = 'Asia/Tokyo'

/** テスト用の WuxingAnalysis を生成する */
function makeAnalysis(overrides: Partial<WuxingAnalysis>): WuxingAnalysis {
  return {
    scores: { 木: 2, 火: 2, 土: 2, 金: 2, 水: 2 },
    dayMasterElement: '木',
    strength: '中和',
    favorableElements: ['木'],
    unfavorableElements: ['金'],
    dominantOrgan: '肝',
    weakestOrgan: '腎',
    explanation: '',
    ...overrides,
  }
}

describe('matchConstitutions', () => {
  test('木が過剰なら肝鬱気滞が候補になる', () => {
    const analysis = makeAnalysis({ scores: { 木: 5, 火: 2, 土: 2, 金: 2, 水: 2 } })
    const matches = matchConstitutions(analysis)
    expect(matches[0].constitutionId).toBe('liver-qi-stagnation')
    expect(matches[0].reasons.length).toBeGreaterThan(0)
  })

  test('水不足＋火過剰なら腎陰虚が候補になる', () => {
    const analysis = makeAnalysis({ scores: { 木: 2, 火: 4, 土: 2, 金: 2, 水: 0.5 } })
    const matches = matchConstitutions(analysis)
    expect(matches.map((m) => m.constitutionId)).toContain('kidney-yin-deficiency')
  })

  test('水と火がともに不足なら腎陽虚が候補になる', () => {
    const analysis = makeAnalysis({ scores: { 木: 2, 火: 0.4, 土: 2.2, 金: 3, 水: 0.4 } })
    const matches = matchConstitutions(analysis)
    expect(matches.map((m) => m.constitutionId)).toContain('kidney-yang-deficiency')
  })

  test('身強なら木・火が不足でも気血両虚は候補にしない', () => {
    // 木・火が不足だが身強のケース（金が突出）
    const analysis = makeAnalysis({
      strength: '身強',
      scores: { 木: 0.5, 火: 0.5, 土: 2, 金: 6, 水: 2 },
    })
    const matches = matchConstitutions(analysis)
    expect(matches.map((m) => m.constitutionId)).not.toContain('qi-blood-deficiency')
  })

  test('身弱なら気血両虚が候補になる', () => {
    const analysis = makeAnalysis({
      strength: '身弱',
      scores: { 木: 1, 火: 2, 土: 3, 金: 3, 水: 1.5 },
    })
    const matches = matchConstitutions(analysis)
    expect(matches.map((m) => m.constitutionId)).toContain('qi-blood-deficiency')
  })

  test('偏りがない場合はフォールバックで1件返す', () => {
    const analysis = makeAnalysis({}) // 全要素 2.0 で均等
    const matches = matchConstitutions(analysis)
    expect(matches).toHaveLength(1)
    expect(matches[0].constitutionId).toBe(FALLBACK_BY_WEAKEST_ELEMENT['木']) // 同点時は木が最弱扱い
    expect(matches[0].reasons[0]).toContain('偏りは大きくありません')
  })

  test('候補は最大4件・スコア降順で返る', () => {
    const analysis = makeAnalysis({
      strength: '身弱',
      scores: { 木: 0.5, 火: 0.5, 土: 5, 金: 3, 水: 0.5 },
    })
    const matches = matchConstitutions(analysis)
    expect(matches.length).toBeLessThanOrEqual(4)
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score)
    }
  })

  test('全マッピングルールの constitutionId が知識ベースに存在する', () => {
    const ids = new Set(ALL_CONSTITUTIONS.map((c) => c.id))
    for (const rule of MAPPING_RULES) {
      expect(ids.has(rule.constitutionId)).toBe(true)
    }
    for (const id of Object.values(FALLBACK_BY_WEAKEST_ELEMENT)) {
      expect(ids.has(id)).toBe(true)
    }
  })
})

describe('buildDiagnosis（Phase 1→2→3→4 の通し連携）', () => {
  test('生年月日から体質タイプ候補まで通して取得できる', () => {
    const bazi = calculateBazi({ birthDate: '1990-05-15', birthTime: '10:30', timezone: TZ })
    const wuxing = analyzeWuxing(bazi)
    const result = buildDiagnosis(bazi, wuxing)

    expect(result.primaryConstitution).toBeDefined()
    expect(result.matches[0].constitutionId).toBe(result.primaryConstitution.id)
    expect(result.matches[0].reasons.length).toBeGreaterThan(0)
    // 1990-05-15 は金5.0で過剰・水0.3で不足 → 腎陰虚系の傾向が候補に入るはず
    expect(result.matches.map((m) => m.constitutionId)).toContain('kidney-yin-deficiency')
  })
})
