// 五行バランス分析 型定義

export type Element = '木' | '火' | '土' | '金' | '水'

/** 日主の強弱判定 */
export type BodyStrength = '身強' | '身弱' | '中和'

export type WuxingAnalysis = {
  /** 五行ごとの合計スコア */
  scores: Record<Element, number>
  /** 日主（日柱天干）の五行 */
  dayMasterElement: Element
  /** 身強・身弱・中和の判定 */
  strength: BodyStrength
  /** 喜神（バランスを整えるとされる五行） */
  favorableElements: Element[]
  /** 忌神（過剰になりやすいとされる五行） */
  unfavorableElements: Element[]
  /** 最も強い五行に対応する五臓 */
  dominantOrgan: string
  /** 最も弱い五行に対応する五臓 */
  weakestOrgan: string
  /** 判定根拠の説明文（表示用・非断定表現） */
  explanation: string
}
