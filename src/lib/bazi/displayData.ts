import type { EarthlyBranch, HeavenlyStem } from '@/types/bazi'

/** 十干の訓読み（甲＝きのえ 等） */
export const STEM_READING: Record<HeavenlyStem, string> = {
  甲: 'きのえ',
  乙: 'きのと',
  丙: 'ひのえ',
  丁: 'ひのと',
  戊: 'つちのえ',
  己: 'つちのと',
  庚: 'かのえ',
  辛: 'かのと',
  壬: 'みずのえ',
  癸: 'みずのと',
}

/** 十干の陰陽（甲＝陽 等。奇数番目が陽、偶数番目が陰） */
export const STEM_YINYANG: Record<HeavenlyStem, '陽' | '陰'> = {
  甲: '陽', 乙: '陰',
  丙: '陽', 丁: '陰',
  戊: '陽', 己: '陰',
  庚: '陽', 辛: '陰',
  壬: '陽', 癸: '陰',
}

/** 十二支の訓読み（子＝ね 等） */
export const BRANCH_READING: Record<EarthlyBranch, string> = {
  子: 'ね',
  丑: 'うし',
  寅: 'とら',
  卯: 'う',
  辰: 'たつ',
  巳: 'み',
  午: 'うま',
  未: 'ひつじ',
  申: 'さる',
  酉: 'とり',
  戌: 'いぬ',
  亥: 'い',
}

/** 蔵干の位置ラベル（本気・中気・余気） */
export const HIDDEN_STEM_LABELS = ['本気', '中気', '余気'] as const
