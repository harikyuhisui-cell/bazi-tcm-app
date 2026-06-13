// 東洋医学（中医学）体質マッチング 型定義
import type { BaziResult } from './bazi'
import type { WuxingAnalysis } from './wuxing'
import type { ConstitutionType } from './constitution'

/** 体質タイプとのマッチ結果 */
export type ConstitutionMatch = {
  /** 体質タイプの id（src/data/constitutions/ に対応） */
  constitutionId: string
  /** マッチスコア（大きいほど傾向が強い） */
  score: number
  /** 判定根拠（表示用・非断定表現） */
  reasons: string[]
}

/** 体質タイプと判定根拠を解決した1件分 */
export type ResolvedConstitution = {
  constitution: ConstitutionType
  /** 判定根拠（表示用・非断定表現） */
  reasons: string[]
}

/** 傾向分析の最終結果（命式→五行→体質タイプ） */
export type DiagnosisResult = {
  bazi: BaziResult
  wuxing: WuxingAnalysis
  /** スコア順の体質タイプ候補（最大4件） */
  matches: ConstitutionMatch[]
  /** スコア順に解決した体質タイプ詳細（最大4件） */
  constitutions: ResolvedConstitution[]
  /** 第一候補の体質タイプ詳細 */
  primaryConstitution: ConstitutionType
  /** 第二候補（存在する場合） */
  secondaryConstitution?: ConstitutionType
}
