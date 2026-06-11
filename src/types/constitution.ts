// 東洋医学 体質タイプ 型定義

/** WHO標準経穴部位（2008）準拠の経穴情報 */
export type Acupoint = {
  /** WHO標準コード 例: LR3 */
  code: string
  /** 経穴名 例: 太衝 */
  name: string
  /** この体質タイプに推奨する理由 */
  reason: string
}

export type ConstitutionType = {
  /** 識別子（kebab-case） */
  id: string
  /** タイプ名（漢字） */
  name: string
  /** 読み仮名 */
  nameKana: string
  /** 一覧表示用の短い説明 */
  shortDescription: string
  /** 性格・心理面の傾向 */
  personality: string[]
  /** 身体面の傾向 */
  physicalTraits: string[]
  /** 不調が出やすい季節 */
  vulnerableSeasons: string[]
  /** 推奨経穴（セルフケアでの指圧・温灸向け） */
  recommendedAcupoints: Acupoint[]
  /** 食養生 */
  foodTherapy: {
    recommend: string[]
    avoid: string[]
  }
  /** 生活習慣のアドバイス */
  lifestyle: {
    do: string[]
    dont: string[]
  }
  /** 注意サイン（該当する場合は医療機関の受診を促す） */
  warningSignals: string[]
}
