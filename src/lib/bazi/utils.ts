import type { BaziPillar, EarthlyBranch, HeavenlyStem } from '@/types/bazi'
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from './constants'

/**
 * "YYYY-MM-DD" 形式の文字列を年月日に分解する。
 * @throws 形式不正・存在しない日付の場合
 */
export function parseDate(birthDate: string): { year: number; month: number; day: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!m) {
    throw new Error(`birthDate は YYYY-MM-DD 形式で指定してください: "${birthDate}"`)
  }
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])]
  // 実在する日付か検証（例: 2/30 や 非閏年の 2/29 を弾く）
  const d = new Date(Date.UTC(year, month - 1, day))
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    throw new Error(`存在しない日付です: "${birthDate}"`)
  }
  return { year, month, day }
}

/**
 * "HH:mm" 形式の文字列を時・分に分解する。
 * @throws 形式不正・範囲外の場合
 */
export function parseTime(birthTime: string): { hour: number; minute: number } {
  const m = /^(\d{2}):(\d{2})$/.exec(birthTime)
  if (!m) {
    throw new Error(`birthTime は HH:mm 形式で指定してください: "${birthTime}"`)
  }
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour > 23 || minute > 59) {
    throw new Error(`時刻が範囲外です: "${birthTime}"`)
  }
  return { hour, minute }
}

/**
 * "庚午" のような干支文字列を BaziPillar に分解する。
 * @throws 干支として不正な文字列の場合
 */
export function parseGanZhi(ganZhi: string): BaziPillar {
  const stem = ganZhi[0] as HeavenlyStem
  const branch = ganZhi[1] as EarthlyBranch
  if (!HEAVENLY_STEMS.includes(stem) || !EARTHLY_BRANCHES.includes(branch)) {
    throw new Error(`干支として解釈できません: "${ganZhi}"`)
  }
  return { stem, branch }
}
