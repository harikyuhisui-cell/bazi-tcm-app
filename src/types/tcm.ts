// 東洋医学（中医学）体質 型定義

export type ConstitutionType =
  | '平和質'
  | '気虚質'
  | '血虚質'
  | '陰虚質'
  | '陽虚質'
  | '気滞質'
  | '血瘀質'
  | '痰湿質'
  | '湿熱質'

export interface ConstitutionScore {
  type: ConstitutionType
  score: number  // 0〜100
}

export interface TcmDiagnosis {
  primaryConstitution: ConstitutionType
  secondaryConstitution?: ConstitutionType
  scores: ConstitutionScore[]
  /** 五行バランスのコメント（表示用） */
  fiveElementComment: string
}
