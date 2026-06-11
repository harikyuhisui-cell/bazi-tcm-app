// 四柱推命 型定義

export type TenStem =
  | '甲' | '乙' | '丙' | '丁' | '戊'
  | '己' | '庚' | '辛' | '壬' | '癸'

export type TwelveBranch =
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥'

export type FiveElement = '木' | '火' | '土' | '金' | '水'

export type YinYang = '陽' | '陰'

export interface Pillar {
  stem: TenStem
  branch: TwelveBranch
  stemElement: FiveElement
  branchElement: FiveElement
  yinYang: YinYang
}

export interface BaziChart {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
  /** 五行ごとのスコア（0〜10） */
  fiveElementScores: Record<FiveElement, number>
}

export interface BirthInfo {
  year: number
  month: number
  day: number
  hour: number   // 0〜23
  minute: number
  /** タイムゾーンオフセット（分）: JST = 540 */
  tzOffsetMinutes: number
}
