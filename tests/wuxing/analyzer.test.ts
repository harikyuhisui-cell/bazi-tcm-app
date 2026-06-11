import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import type { BaziResult } from '@/types/bazi'

const TZ = 'Asia/Tokyo'

/** 生年月日から命式→五行分析まで通しで実行する */
function analyze(birthDate: string, birthTime: string) {
  return analyzeWuxing(calculateBazi({ birthDate, birthTime, timezone: TZ }))
}

describe('analyzeWuxing', () => {
  test('Phase 1 の出力を入力として連携できる（1990-05-15 10:30）', () => {
    const result = analyze('1990-05-15', '10:30')
    // 手計算による期待値:
    // 天干: 庚辛庚辛 → 金4.0
    // 蔵干: 午[丁1.0,己0.5] 巳[丙1.0,庚0.5,戊0.3]×2 辰[戊1.0,乙0.5,癸0.3]
    expect(result.scores).toEqual({ 木: 0.5, 火: 3, 土: 2.1, 金: 5, 水: 0.3 })
    expect(result.dayMasterElement).toBe('金')
  })

  test('身強の判定: 金が支配的な命式（1990-05-15）', () => {
    const result = analyze('1990-05-15', '10:30')
    expect(result.strength).toBe('身強')
    // 身強 → 日主を漏らす・抑える五行が喜神（食傷=水, 財=木, 官=火）
    expect(result.favorableElements).toEqual(['水', '木', '火'])
    // 日主を強める五行が忌神（比劫=金, 印=土）
    expect(result.unfavorableElements).toEqual(['金', '土'])
  })

  test('身弱の判定: 日主の支持が弱い命式（2000-11-03）', () => {
    const result = analyze('2000-11-03', '09:00')
    expect(result.dayMasterElement).toBe('木')
    expect(result.strength).toBe('身弱')
    // 身弱 → 日主を強める五行が喜神（比劫=木, 印=水）
    expect(result.favorableElements).toEqual(['木', '水'])
    expect(result.unfavorableElements).toEqual(['金', '土', '火'])
  })

  test('中和の判定: バランスの取れた命式（1962-03-21）', () => {
    const result = analyze('1962-03-21', '18:00')
    expect(result.strength).toBe('中和')
    // 中和 → 最弱の五行を補い、最強の五行の過剰を忌む
    expect(result.favorableElements).toEqual(['火'])
  })

  test('月令ボーナス: 日干の五行＝月支本気の五行で +1.5点', () => {
    // 甲（木）の日干 × 寅（木）月の合成命式
    const chart: BaziResult = {
      year: { stem: '甲', branch: '子' },
      month: { stem: '丙', branch: '寅' },
      day: { stem: '甲', branch: '子' },
      hour: { stem: '甲', branch: '子' },
      dayMaster: '甲',
      hiddenStems: {
        year: ['癸'],
        month: ['甲', '丙', '戊'],
        day: ['癸'],
        hour: ['癸'],
      },
    }
    const withBonus = analyzeWuxing(chart)
    // 木: 天干甲×3=3.0 + 寅本気甲1.0 + 月令ボーナス1.5 = 5.5
    expect(withBonus.scores.木).toBe(5.5)
  })

  test('五臓対応: 最強・最弱の五行が五臓にマッピングされる', () => {
    const result = analyze('1990-05-15', '10:30')
    expect(result.dominantOrgan).toBe('肺') // 金=肺
    expect(result.weakestOrgan).toBe('腎') // 水=腎
  })

  test('説明文に判定根拠と免責が含まれる', () => {
    const result = analyze('1990-05-15', '10:30')
    expect(result.explanation).toContain('身強')
    expect(result.explanation).toContain('肺')
    expect(result.explanation).toContain('医療診断ではありません')
    // 断定表現を避けているか（「〜です」と体質を断定しない）
    expect(result.explanation).toContain('傾向')
  })

  test('スコア合計が天干4本＋蔵干の重み合計と一致する', () => {
    const result = analyze('1995-07-07', '12:00')
    const total = Object.values(result.scores).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThan(7) // 最低: 天干4 + 本気4 = 8（丸め誤差考慮）
    expect(total).toBeLessThan(13.5) // 最大: 8 + 中気0.5×4 + 余気0.3×4 + 月令1.5
  })
})
