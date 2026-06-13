import type { Element, WuxingAnalysis } from '@/types/wuxing'

/**
 * 五行の偏りを判定するしきい値（全体に占める比率）
 * ※ヒューリスティックであり、監修者レビューの対象
 */
export const RATIO_THRESHOLDS = {
  /** この比率以上で「過剰」とみなす */
  excess: 0.28,
  /** この比率以下で「不足」とみなす */
  deficient: 0.1,
} as const

/** ある五行の全体比率を返す */
export function elementRatio(analysis: WuxingAnalysis, element: Element): number {
  const total = (Object.values(analysis.scores) as number[]).reduce((a, b) => a + b, 0)
  return total === 0 ? 0 : analysis.scores[element] / total
}

/** 五行が過剰か */
export function isExcess(analysis: WuxingAnalysis, element: Element): boolean {
  return elementRatio(analysis, element) >= RATIO_THRESHOLDS.excess
}

/** 五行が不足か */
export function isDeficient(analysis: WuxingAnalysis, element: Element): boolean {
  return elementRatio(analysis, element) <= RATIO_THRESHOLDS.deficient
}

/** マッピングルール1件: 条件を満たせばスコアと根拠を加算する */
export type MappingRule = {
  constitutionId: string
  points: number
  /** 条件（満たした場合に points を加算） */
  matches: (analysis: WuxingAnalysis) => boolean
  /** 表示用の根拠文（非断定表現） */
  reason: string
}

/**
 * 五行バランス → 体質タイプのマッピングルール
 * ※五行と臓腑の対応（木=肝・火=心・土=脾・金=肺・水=腎）に基づくヒューリスティック。
 *   しきい値・配点とも監修者レビューの対象。
 */
export const MAPPING_RULES: readonly MappingRule[] = [
  // 肝鬱気滞: 木の過剰（肝気の高ぶり・滞り）
  {
    constitutionId: 'liver-qi-stagnation',
    points: 2,
    matches: (a) => isExcess(a, '木'),
    reason: '木（肝）の気が強く、気の巡りが滞りやすい配置が見られます',
  },
  {
    constitutionId: 'liver-qi-stagnation',
    points: 1,
    matches: (a) => a.dayMasterElement === '木' && a.strength === '身強',
    reason: '日主が木で身強のため、肝気が高ぶりやすい傾向があります',
  },
  // 心火亢盛: 火の過剰
  {
    constitutionId: 'heart-fire',
    points: 2,
    matches: (a) => isExcess(a, '火'),
    reason: '火（心）の気が強く、熱が高ぶりやすい配置が見られます',
  },
  {
    constitutionId: 'heart-fire',
    points: 1,
    matches: (a) => a.dayMasterElement === '火' && a.strength === '身強',
    reason: '日主が火で身強のため、心火が亢進しやすい傾向があります',
  },
  // 脾虚湿盛: 土の不足
  {
    constitutionId: 'spleen-deficiency',
    points: 2,
    matches: (a) => isDeficient(a, '土'),
    reason: '土（脾）の気が弱く、消化吸収と水分代謝が乱れやすい配置です',
  },
  {
    constitutionId: 'spleen-deficiency',
    points: 1,
    matches: (a) => isExcess(a, '木') && isDeficient(a, '土'),
    reason: '木が土を剋す（木乗土）配置で、脾が負担を受けやすい傾向があります',
  },
  // 肺気虚: 金の不足
  {
    constitutionId: 'lung-qi-deficiency',
    points: 2,
    matches: (a) => isDeficient(a, '金'),
    reason: '金（肺）の気が弱く、防衛の気が不足しやすい配置です',
  },
  {
    constitutionId: 'lung-qi-deficiency',
    points: 1,
    matches: (a) => isExcess(a, '火') && isDeficient(a, '金'),
    reason: '火が金を剋す（火乗金）配置で、肺が消耗しやすい傾向があります',
  },
  // 腎陰虚: 水の不足＋火の過剰（虚熱）
  {
    constitutionId: 'kidney-yin-deficiency',
    points: 2,
    matches: (a) => isDeficient(a, '水') && isExcess(a, '火'),
    reason: '水（腎）が弱く火が強い配置で、潤い不足からほてりが出やすい傾向です',
  },
  {
    constitutionId: 'kidney-yin-deficiency',
    points: 1,
    matches: (a) => isDeficient(a, '水') && !isDeficient(a, '火'),
    reason: '水（腎）の気が弱く、陰液が不足しやすい配置です',
  },
  // 腎陽虚: 水の不足＋火の不足（温める力の不足）
  {
    constitutionId: 'kidney-yang-deficiency',
    points: 2,
    matches: (a) => isDeficient(a, '水') && isDeficient(a, '火'),
    reason: '水（腎）と火（温める力）がともに弱く、冷えが出やすい配置です',
  },
  {
    constitutionId: 'kidney-yang-deficiency',
    points: 1,
    matches: (a) => a.dayMasterElement === '水' && a.strength === '身弱' && isDeficient(a, '火'),
    reason: '日主が水で身弱、かつ火が弱いため、陽気が不足しやすい傾向です',
  },
  // 気血両虚: 身弱（日主を支える力の全般的な不足）
  {
    constitutionId: 'qi-blood-deficiency',
    points: 2,
    matches: (a) => a.strength === '身弱',
    reason: '日主を支える力が弱い「身弱」の配置で、気血が不足しやすい傾向です',
  },
  {
    constitutionId: 'qi-blood-deficiency',
    points: 1,
    // 身強（日主が充実）の場合は気血の不足傾向とはみなさない
    matches: (a) => a.strength !== '身強' && (isDeficient(a, '木') || isDeficient(a, '火')),
    reason: '気血の巡りに関わる木・火の気に不足が見られます',
  },
  // 痰湿瘀血: 土の過剰（湿の停滞）＋巡りの滞り
  {
    constitutionId: 'phlegm-blood-stasis',
    points: 2,
    matches: (a) => isExcess(a, '土'),
    reason: '土の気が過剰で、余分な湿を溜め込みやすい配置が見られます',
  },
  {
    constitutionId: 'phlegm-blood-stasis',
    points: 1,
    matches: (a) => isExcess(a, '土') && isDeficient(a, '水'),
    reason: '土が水を剋す（土剋水）配置で、水分代謝が滞りやすい傾向です',
  },
] as const

/**
 * フォールバック: どのルールにも該当しない場合、最弱の五行から体質タイプを推定する
 */
export const FALLBACK_BY_WEAKEST_ELEMENT: Record<Element, string> = {
  木: 'liver-qi-stagnation', // 肝の気の乱れ（弱りも滞りの一因とされる）
  火: 'qi-blood-deficiency', // 火（心=血脈）の弱り → 気血の不足傾向
  土: 'spleen-deficiency',
  金: 'lung-qi-deficiency',
  水: 'kidney-yin-deficiency',
}
