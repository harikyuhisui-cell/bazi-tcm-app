import { isGynecological, filterByGender } from '@/lib/tcm/gender'
import { visibleSymptomItems, pruneSymptomIdsByGender, SYMPTOM_ITEMS } from '@/lib/tcm/symptoms'

describe('isGynecological', () => {
  test('月経・婦人科などのキーワードを婦人科系と判定する', () => {
    expect(isGynecological('月経量が少ない')).toBe(true)
    expect(isGynecological('医療機関（内科・婦人科など）')).toBe(true)
    expect(isGynecological('胸や脇腹が張った感じ')).toBe(false)
  })
})

describe('filterByGender', () => {
  const items = ['月経痛が強い', '肩こりが慢性的', '婦人科系の不調']

  test('女性は全項目を残す', () => {
    expect(filterByGender(items, 'female', (s) => s)).toEqual(items)
  })

  test('男性は婦人科系を除外する', () => {
    expect(filterByGender(items, 'male', (s) => s)).toEqual(['肩こりが慢性的'])
  })
})

describe('symptoms（性別フィルタ）', () => {
  test('男性向けの症状項目は婦人科系を含まない', () => {
    const male = visibleSymptomItems('male')
    expect(male.every((s) => !isGynecological(s.label))).toBe(true)
    // 女性向けより項目数が少ない（婦人科系が除外される）
    expect(male.length).toBeLessThan(visibleSymptomItems('female').length)
  })

  test('pruneSymptomIdsByGender が男性で婦人科系IDを取り除く', () => {
    const gyneItem = SYMPTOM_ITEMS.find((s) => isGynecological(s.label))!
    const ids = [gyneItem.id, 'heart-fire-0']
    expect(pruneSymptomIdsByGender(ids, 'male')).toEqual(['heart-fire-0'])
    expect(pruneSymptomIdsByGender(ids, 'female')).toEqual(ids)
  })
})
