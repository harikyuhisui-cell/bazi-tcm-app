import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import { matchConstitutions } from '@/lib/tcm/matcher'
import { SYMPTOM_ITEMS, countSymptomsByConstitution } from '@/lib/tcm/symptoms'
import { ALL_CONSTITUTIONS } from '@/data/constitutions'

describe('SYMPTOM_ITEMS', () => {
  test('全 physicalTraits からチェック項目が生成される', () => {
    const expected = ALL_CONSTITUTIONS.reduce((n, c) => n + c.physicalTraits.length, 0)
    expect(SYMPTOM_ITEMS).toHaveLength(expected)
  })

  test('各項目のIDは一意で、constitutionId が知識ベースに存在する', () => {
    const ids = new Set(SYMPTOM_ITEMS.map((s) => s.id))
    expect(ids.size).toBe(SYMPTOM_ITEMS.length)
    const validIds = new Set(ALL_CONSTITUTIONS.map((c) => c.id))
    for (const item of SYMPTOM_ITEMS) {
      expect(validIds.has(item.constitutionId)).toBe(true)
    }
  })
})

describe('countSymptomsByConstitution', () => {
  test('チェックした症状を体質タイプごとに集計する', () => {
    const heartFireSymptoms = SYMPTOM_ITEMS.filter((s) => s.constitutionId === 'heart-fire')
    const checked = heartFireSymptoms.slice(0, 2).map((s) => s.id)
    const counts = countSymptomsByConstitution(checked)
    expect(counts.get('heart-fire')).toBe(2)
  })
})

describe('matchConstitutions（症状の加味）', () => {
  test('チェックした不調が候補スコアに上乗せされる', () => {
    // 命式は均等で偏りが小さいケース
    const bazi = calculateBazi({ birthDate: '1962-03-21', birthTime: '18:00', timezone: 'Asia/Tokyo' })
    const wuxing = analyzeWuxing(bazi)

    const heartFireSymptoms = SYMPTOM_ITEMS.filter((s) => s.constitutionId === 'heart-fire').map(
      (s) => s.id
    )
    const withSymptoms = matchConstitutions(wuxing, heartFireSymptoms)

    // 心火亢盛が候補入りし、根拠に自覚症状の言及が含まれる
    const heartFire = withSymptoms.find((m) => m.constitutionId === 'heart-fire')
    expect(heartFire).toBeDefined()
    expect(heartFire!.reasons.some((r) => r.includes('当てはまっています'))).toBe(true)
  })

  test('症状なしの場合は従来どおり命式のみで判定する', () => {
    const bazi = calculateBazi({ birthDate: '1990-05-15', birthTime: '10:30', timezone: 'Asia/Tokyo' })
    const wuxing = analyzeWuxing(bazi)
    const a = matchConstitutions(wuxing)
    const b = matchConstitutions(wuxing, [])
    expect(a).toEqual(b)
  })
})
