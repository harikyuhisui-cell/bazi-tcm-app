import { calculateBazi } from '@/lib/bazi/calculator'
import { parseDate, parseTime } from '@/lib/bazi/utils'

const TZ = 'Asia/Tokyo'

describe('calculateBazi', () => {
  test('通常ケース: 1990-05-15 10:30', () => {
    const result = calculateBazi({ birthDate: '1990-05-15', birthTime: '10:30', timezone: TZ })
    expect(result.year).toEqual({ stem: '庚', branch: '午' })
    expect(result.month).toEqual({ stem: '辛', branch: '巳' })
    expect(result.day).toEqual({ stem: '庚', branch: '辰' })
    expect(result.hour).toEqual({ stem: '辛', branch: '巳' })
    expect(result.dayMaster).toBe('庚')
    // 蔵干: 午=[丁,己] 巳=[丙,庚,戊] 辰=[戊,乙,癸]
    expect(result.hiddenStems.year).toEqual(['丁', '己'])
    expect(result.hiddenStems.month).toEqual(['丙', '庚', '戊'])
    expect(result.hiddenStems.day).toEqual(['戊', '乙', '癸'])
    expect(result.hiddenStems.hour).toEqual(['丙', '庚', '戊'])
  })

  test('立春前: 1990-02-03 は前年（己巳年・丑月）扱い', () => {
    const result = calculateBazi({ birthDate: '1990-02-03', birthTime: '12:00', timezone: TZ })
    expect(result.year).toEqual({ stem: '己', branch: '巳' })
    expect(result.month).toEqual({ stem: '丁', branch: '丑' })
  })

  test('立春後: 1990-02-05 は新年（庚午年・寅月）扱い', () => {
    const result = calculateBazi({ birthDate: '1990-02-05', birthTime: '12:00', timezone: TZ })
    expect(result.year).toEqual({ stem: '庚', branch: '午' })
    expect(result.month).toEqual({ stem: '戊', branch: '寅' })
  })

  test('子の刻の日跨ぎ: 23:30 は翌日の日柱・子の刻となる', () => {
    const lateNight = calculateBazi({ birthDate: '1990-05-15', birthTime: '23:30', timezone: TZ })
    // 晩子時＝翌日説: 5/15 23:30 の日柱は 5/16 と同じ 辛巳
    expect(lateNight.day).toEqual({ stem: '辛', branch: '巳' })
    expect(lateNight.hour).toEqual({ stem: '戊', branch: '子' })

    const earlyMorning = calculateBazi({ birthDate: '1990-05-16', birthTime: '00:30', timezone: TZ })
    expect(earlyMorning.day).toEqual({ stem: '辛', branch: '巳' })
    expect(earlyMorning.hour).toEqual({ stem: '戊', branch: '子' })
  })

  test('閏年: 2000-02-29 が正しく計算される', () => {
    const result = calculateBazi({ birthDate: '2000-02-29', birthTime: '12:00', timezone: TZ })
    expect(result.year).toEqual({ stem: '庚', branch: '辰' })
    expect(result.month).toEqual({ stem: '戊', branch: '寅' })
    expect(result.day).toEqual({ stem: '丁', branch: '巳' })
    expect(result.hour).toEqual({ stem: '丙', branch: '午' })
  })

  test('著名人検証: 毛沢東 1893-12-26 辰時 → 癸巳 甲子 丁酉 甲辰', () => {
    // 文献で広く知られる命式と一致することを確認
    const result = calculateBazi({ birthDate: '1893-12-26', birthTime: '08:00', timezone: TZ })
    expect(result.year).toEqual({ stem: '癸', branch: '巳' })
    expect(result.month).toEqual({ stem: '甲', branch: '子' })
    expect(result.day).toEqual({ stem: '丁', branch: '酉' })
    expect(result.hour).toEqual({ stem: '甲', branch: '辰' })
    expect(result.dayMaster).toBe('丁')
  })

  test('不正な入力はエラーを投げる', () => {
    expect(() =>
      calculateBazi({ birthDate: '1990/05/15', birthTime: '10:30', timezone: TZ })
    ).toThrow()
    expect(() =>
      calculateBazi({ birthDate: '2001-02-29', birthTime: '10:30', timezone: TZ })
    ).toThrow() // 非閏年の2/29
    expect(() =>
      calculateBazi({ birthDate: '1990-05-15', birthTime: '25:00', timezone: TZ })
    ).toThrow()
  })
})

describe('utils', () => {
  test('parseDate が正しく分解する', () => {
    expect(parseDate('2000-02-29')).toEqual({ year: 2000, month: 2, day: 29 })
  })

  test('parseTime が正しく分解する', () => {
    expect(parseTime('23:59')).toEqual({ hour: 23, minute: 59 })
  })
})
