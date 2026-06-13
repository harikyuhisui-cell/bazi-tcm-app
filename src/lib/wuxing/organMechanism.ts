import type { Element } from '@/types/wuxing'

/**
 * 五行の過多（強すぎ）・欠乏（弱すぎ）による不調のメカニズム。
 * 監修鍼灸師の資料『日柱の増減による不調』に基づき、相剋（五行が互いに
 * 傷つけ合う法則）の観点で、各五行が「働きすぎて他を攻撃する／弱くて
 * 他から攻撃される」連鎖を表す。
 *
 * ※具体的な病名を断定するものではなく、東洋医学的なエネルギーの偏り・
 *   体質の傾向を示す参考情報。
 */
export type OrganMechanism = {
  /** 司る部位 */
  governs: string
  /** 過多（強すぎ）の場合 */
  excess: {
    /** その臓器自身に出やすい不調 */
    self: string
    /** 相剋の法則名（例: 木剋土） */
    law: string
    /** 攻撃が波及する先の五行 */
    target: Element
    /** 波及先に出やすい不調 */
    targetEffect: string
  }
  /** 欠乏（弱すぎ）の場合 */
  deficient: {
    /** その臓器自身に出やすい虚弱 */
    self: string
    /** 相剋の法則名（例: 金剋木） */
    law: string
    /** 一方的に攻撃してくる側の五行 */
    source: Element
    /** その攻撃で出やすい不調 */
    sourceEffect: string
  }
}

export const ORGAN_MECHANISM: Record<Element, OrganMechanism> = {
  木: {
    governs: '肝臓・頭部・胸部',
    excess: {
      self: '肝臓の酷使による疲労、頭に血が上りやすくイライラしやすい状態',
      law: '木剋土',
      target: '土',
      targetEffect: '胃腸（土）への負担（ストレス性の胃腸炎のような図式）',
    },
    deficient: {
      self: '解毒力やスタミナの不足、お酒に弱い、慢性的な疲労感',
      law: '金剋木',
      source: '金',
      sourceEffect: '呼吸器（金）など他の強い気から一方的にダメージを受けやすく、頭部や肝臓に不調が出やすい',
    },
  },
  火: {
    governs: '心臓（血管系統）・脳・眼',
    excess: {
      self: '心臓や脳のオーバーヒート（動悸・血圧の上昇・眼精疲労・神経の高ぶり）',
      law: '火剋金',
      target: '金',
      targetEffect: '呼吸器（金）の乾燥による咳や、筋骨のトラブル',
    },
    deficient: {
      self: '血液や熱を巡らせるポンプ力の不足（低血圧・極端な冷え性・活力の低下）',
      law: '水剋火',
      source: '水',
      sourceEffect: '冷え（水）に圧倒され、心臓の動きがさらに鈍る悪循環に陥りやすい',
    },
  },
  土: {
    governs: '胃腸・消化器',
    excess: {
      self: '胃腸の働きすぎによる負担過重、エネルギーの渋滞（滞り）',
      law: '土剋水',
      target: '水',
      targetEffect: 'むくみ・冷え・血圧トラブルなど水（腎）の不調の併発',
    },
    deficient: {
      self: '消化吸収力の低下、少しの負担での胃もたれや不調（虚弱）',
      law: '木剋土',
      source: '木',
      sourceEffect: 'ストレス（木）が防御力の弱い胃腸を直接攻撃して不調を招きやすい',
    },
  },
  金: {
    governs: '肺臓・呼吸器（気管）・骨格',
    excess: {
      self: '呼吸器や皮膚の過敏、骨格（関節）への負担、呼吸の浅さや身体の緊張・硬さ',
      law: '金剋木',
      target: '木',
      targetEffect: '肝臓（木）の疲労、頭痛や神経の苛立ち',
    },
    deficient: {
      self: '風邪をひきやすい、咳が長引きやすい、骨がもろくなりやすい（虚弱）',
      law: '火剋金',
      source: '火',
      sourceEffect: '熱（火）を伴う不調から防御力の弱い呼吸器が一気にダメージを受けやすい',
    },
  },
  水: {
    governs: '腎臓・膀胱・排泄器官・血圧',
    excess: {
      self: '腎臓のフル稼働（働きすぎ）、冷たい水分の滞りによる極端なむくみ・冷え性',
      law: '水剋火',
      target: '火',
      targetEffect: '心臓（火）の働きの鈍り、血圧の異常や循環器のトラブル、気力の低下',
    },
    deficient: {
      self: '水分代謝や潤いの不足、老廃物を濾過する力の弱さ、乾燥しやすさ',
      law: '土剋水',
      source: '土',
      sourceEffect: '暴飲暴食など胃腸（土）の乱れが少ない水分代謝を塞ぎ、血液の汚れや腎機能の低下につながりやすい',
    },
  },
}
