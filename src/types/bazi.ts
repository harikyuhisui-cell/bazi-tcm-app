// 四柱推命 型定義

/** 十干 */
export type HeavenlyStem =
  | '甲' | '乙' | '丙' | '丁' | '戊'
  | '己' | '庚' | '辛' | '壬' | '癸'

/** 十二支 */
export type EarthlyBranch =
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥'

/** 五行 */
export type FiveElement = '木' | '火' | '土' | '金' | '水'

/** 柱（天干＋地支） */
export type BaziPillar = { stem: string; branch: string }

/** 命式の算出結果 */
export type BaziResult = {
  year: BaziPillar
  month: BaziPillar
  day: BaziPillar
  hour: BaziPillar
  /** 日主（日柱の天干）。体質判定の中心となる */
  dayMaster: string
  /** 蔵干（各柱の地支に内蔵される天干） */
  hiddenStems: {
    year: string[]
    month: string[]
    day: string[]
    hour: string[]
  }
}

/** calculateBazi の入力 */
export type BaziInput = {
  /** 生年月日 YYYY-MM-DD */
  birthDate: string
  /** 出生時刻 HH:mm（24時間表記） */
  birthTime: string
  /** IANAタイムゾーン 例: 'Asia/Tokyo' */
  timezone: string
}
