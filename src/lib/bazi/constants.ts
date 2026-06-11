import type { EarthlyBranch, FiveElement, HeavenlyStem } from '@/types/bazi'

/** 十干（甲から癸まで） */
export const HEAVENLY_STEMS: readonly HeavenlyStem[] = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
] as const

/** 十二支（子から亥まで） */
export const EARTHLY_BRANCHES: readonly EarthlyBranch[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
] as const

/** 十干の五行対応 */
export const STEM_TO_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

/** 十二支の五行対応（本気ベース） */
export const BRANCH_TO_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

/**
 * 蔵干テーブル（地支に内蔵される天干）
 * 順序は [本気, 中気, 余気]。中気・余気がない地支は要素数が少ない。
 * ※ 流派により中気・余気の扱いが異なるが、本アプリは標準的な配置を採用
 */
export const HIDDEN_STEMS: Record<EarthlyBranch, readonly HeavenlyStem[]> = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '庚', '戊'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
}
