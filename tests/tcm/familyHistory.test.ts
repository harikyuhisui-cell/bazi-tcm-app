import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import { matchConstitutions } from '@/lib/tcm/matcher'
import {
  FAMILY_HISTORY_ITEMS,
  countFamilyByConstitution,
} from '@/lib/tcm/familyHistory'
import { ALL_CONSTITUTIONS } from '@/data/constitutions'

describe('FAMILY_HISTORY_ITEMS', () => {
  test('IDは一意で、対応する constitutionId はすべて知識ベースに存在する', () => {
    const ids = new Set(FAMILY_HISTORY_ITEMS.map((i) => i.id))
    expect(ids.size).toBe(FAMILY_HISTORY_ITEMS.length)

    const valid = new Set(ALL_CONSTITUTIONS.map((c) => c.id))
    for (const item of FAMILY_HISTORY_ITEMS) {
      expect(item.constitutionIds.length).toBeGreaterThan(0)
      for (const cid of item.constitutionIds) {
        expect(valid.has(cid)).toBe(true)
      }
    }
  })
})

describe('countFamilyByConstitution', () => {
  test('複数タイプに対応する項目は各タイプに加算する', () => {
    // hypertension → phlegm-blood-stasis, liver-qi-stagnation
    const counts = countFamilyByConstitution(['hypertension'])
    expect(counts.get('phlegm-blood-stasis')).toBe(1)
    expect(counts.get('liver-qi-stagnation')).toBe(1)
  })

  test('同じタイプを指す複数項目は合算する', () => {
    // allergy と asthma はいずれも lung-qi-deficiency
    const counts = countFamilyByConstitution(['allergy', 'asthma'])
    expect(counts.get('lung-qi-deficiency')).toBe(2)
  })
})

describe('matchConstitutions（家族歴の加味）', () => {
  test('家族歴が候補スコアに上乗せされ、根拠に反映される', () => {
    const wuxing = analyzeWuxing(
      calculateBazi({ birthDate: '1962-03-21', birthTime: '18:00', timezone: 'Asia/Tokyo' })
    )
    const matches = matchConstitutions(wuxing, [], ['anemia', 'coldness'])
    const qbd = matches.find((m) => m.constitutionId === 'qi-blood-deficiency')
    expect(qbd).toBeDefined()
    expect(qbd!.reasons.some((r) => r.includes('ご家族の体質傾向'))).toBe(true)
  })

  test('家族歴なしなら従来どおりの結果になる', () => {
    const wuxing = analyzeWuxing(
      calculateBazi({ birthDate: '1990-05-15', birthTime: '10:30', timezone: 'Asia/Tokyo' })
    )
    expect(matchConstitutions(wuxing, [], [])).toEqual(matchConstitutions(wuxing))
  })

  test('家族歴は自覚症状より軽い重み（0.5点）で加味される', () => {
    const wuxing = analyzeWuxing(
      calculateBazi({ birthDate: '1962-03-21', birthTime: '18:00', timezone: 'Asia/Tokyo' })
    )
    // stomach → spleen-deficiency のみ。家族歴1件で +0.5
    const before = matchConstitutions(wuxing).find((m) => m.constitutionId === 'spleen-deficiency')
    const after = matchConstitutions(wuxing, [], ['stomach', 'stomach']) // 重複は集合で1件
    const afterSpleen = after.find((m) => m.constitutionId === 'spleen-deficiency')
    const beforeScore = before?.score ?? 0
    expect((afterSpleen?.score ?? 0) - beforeScore).toBeCloseTo(0.5)
  })
})
