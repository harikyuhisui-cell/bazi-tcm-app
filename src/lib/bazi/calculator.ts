import { Solar } from 'lunar-javascript'
import type { BaziInput, BaziPillar, BaziResult, EarthlyBranch } from '@/types/bazi'
import { HIDDEN_STEMS } from './constants'
import { parseDate, parseGanZhi, parseTime } from './utils'

/**
 * 生年月日時から四柱推命の命式を算出する。
 *
 * - 年柱・月柱は節入り（24節気）基準で決定する（立春で年が変わる）。
 * - 子の刻（23:00〜00:59）のうち 23時台は翌日の日柱として扱う（晩子時＝翌日説）。
 * - timezone は入力時刻の解釈を明示するためのフィールド。命式は出生地の
 *   現地時刻（壁時計時刻）で計算するのが原則のため、時差変換は行わない。
 *
 * @param input 生年月日（YYYY-MM-DD）・出生時刻（HH:mm）・タイムゾーン
 * @returns 四柱・日主・蔵干を含む命式
 * @throws 日付・時刻の形式が不正な場合
 */
export function calculateBazi(input: BaziInput): BaziResult {
  const { year, month, day } = parseDate(input.birthDate)
  const { hour, minute } = parseTime(input.birthTime)

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
  const eightChar = solar.getLunar().getEightChar()
  // sect 1: 23時以降（晩子時）は翌日の日柱とする
  eightChar.setSect(1)

  const yearPillar = parseGanZhi(eightChar.getYear())
  const monthPillar = parseGanZhi(eightChar.getMonth())
  const dayPillar = parseGanZhi(eightChar.getDay())
  const hourPillar = parseGanZhi(eightChar.getTime())

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: dayPillar.stem,
    hiddenStems: {
      year: hiddenStemsOf(yearPillar),
      month: hiddenStemsOf(monthPillar),
      day: hiddenStemsOf(dayPillar),
      hour: hiddenStemsOf(hourPillar),
    },
  }
}

/**
 * 柱の地支から蔵干（内蔵される天干）を取得する。
 * @param pillar 対象の柱
 * @returns 蔵干の配列（[本気, 中気, 余気] の順）
 */
function hiddenStemsOf(pillar: BaziPillar): string[] {
  return [...HIDDEN_STEMS[pillar.branch as EarthlyBranch]]
}
