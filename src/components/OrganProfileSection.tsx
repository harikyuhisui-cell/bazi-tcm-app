import type { Element, WuxingAnalysis } from '@/types/wuxing'
import {
  ELEMENT_STYLE,
  ELEMENT_ORDER,
  ELEMENT_CORRESPONDENCE,
  organStatusOf,
  type OrganStatus,
} from '@/lib/wuxing/elementStyle'
import { SectionHeading, KANJI_NUMERALS } from './SectionHeading'

type Props = {
  analysis: WuxingAnalysis
  /** セクション番号（0始まり）。既定は2（參） */
  sectionIndex?: number
}

const STATUS_LABEL: Record<OrganStatus, string> = {
  excess: '過剰',
  normal: '適正',
  deficient: '虚弱',
}

const STATUS_BADGE: Record<OrganStatus, string> = {
  excess: 'bg-red-50 text-red-600',
  normal: 'bg-emerald-50 text-emerald-700',
  deficient: 'bg-blue-50 text-blue-600',
}

const STATUS_ARROW: Record<OrganStatus, string> = {
  excess: '↗',
  normal: '—',
  deficient: '↘',
}

const STATUS_CARD: Record<OrganStatus, string> = {
  excess: 'border-[#f0d8c8] bg-[#fdf4ee]',
  normal: 'border-[#ece6d8] bg-white',
  deficient: 'border-[#ece6d8] bg-white',
}

const STATUS_NOTE: Record<OrganStatus, string> = {
  excess: 'bg-orange-50 text-orange-800',
  normal: 'bg-emerald-50 text-emerald-800',
  deficient: 'bg-blue-50 text-blue-800',
}

/** 状態に応じた説明文を組み立てる（非断定・参考表現） */
function describe(status: OrganStatus, c: (typeof ELEMENT_CORRESPONDENCE)[Element]): string {
  if (status === 'excess') {
    return `${c.organ}の気が亢進しやすい傾向があります。「${c.emotion}」の感情に影響を受けやすく、${c.body}に症状が現れやすい傾向があるとされます。`
  }
  if (status === 'deficient') {
    return `${c.organ}の気が虚弱になりやすい傾向があります。${c.body}のケアと適切な養生を心がけることが参考になります。`
  }
  return `${c.organ}のバランスが比較的整っている傾向があります。現状の養生を継続することが大切です。`
}

/** スコアのドーナツリング（SVG） */
function ScoreRing({ score, max, color }: { score: number; max: number; color: string }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const filled = max === 0 ? 0 : (score / max) * circ
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" className="shrink-0">
      <circle cx={28} cy={28} r={r} fill="none" stroke="#eee7d8" strokeWidth={5} />
      <circle
        cx={28}
        cy={28}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 28 28)"
      />
      <text x={28} y={32} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}>
        {score}
      </text>
    </svg>
  )
}

/** 五臓体質プロフィールセクション */
export function OrganProfileSection({ analysis, sectionIndex = 2 }: Props) {
  const { scores } = analysis
  const total = ELEMENT_ORDER.reduce((sum, el) => sum + scores[el], 0)
  const max = Math.max(...ELEMENT_ORDER.map((el) => scores[el]), 1)

  const strongest = ELEMENT_ORDER.reduce((a, b) => (scores[b] > scores[a] ? b : a))
  const weakest = ELEMENT_ORDER.reduce((a, b) => (scores[b] < scores[a] ? b : a))

  // スコア降順で並べる
  const sorted = [...ELEMENT_ORDER].sort((a, b) => scores[b] - scores[a])

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading
        numberKanji={KANJI_NUMERALS[sectionIndex]}
        title="五臓体質プロフィール"
        subtitle="五行バランスから読み解く東洋医学的な体質の傾向"
      />

      {/* サマリー */}
      <div className="rounded-xl border border-[#ece6d8] bg-[#faf6ec] px-5 py-3 text-sm">
        <span className="text-gray-600">最も強い傾向：</span>
        <span className="ml-1 text-lg font-bold" style={{ color: ELEMENT_STYLE[strongest].color }}>
          {ELEMENT_CORRESPONDENCE[strongest].organ}
        </span>
        <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600">↗ 過剰</span>
        <span className="mx-3 text-gray-300">｜</span>
        <span className="text-gray-600">最も弱い傾向：</span>
        <span className="ml-1 text-lg font-bold" style={{ color: ELEMENT_STYLE[weakest].color }}>
          {ELEMENT_CORRESPONDENCE[weakest].organ}
        </span>
        <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">↘ 虚弱</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sorted.map((el) => {
          const c = ELEMENT_CORRESPONDENCE[el]
          const style = ELEMENT_STYLE[el]
          const ratio = total === 0 ? 0 : scores[el] / total
          const status = organStatusOf(ratio)
          return (
            <div key={el} className={`rounded-2xl border p-5 shadow-sm ${STATUS_CARD[status]}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ScoreRing score={scores[el]} max={max} color={style.color} />
                  <div>
                    <p className="text-xl font-bold">
                      <span style={{ color: style.color }}>{el}</span>{' '}
                      <span className="text-gray-700">{c.organ}</span>
                    </p>
                    <span
                      className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${STATUS_BADGE[status]}`}
                    >
                      {STATUS_ARROW[status]} {STATUS_LABEL[status]}
                    </span>
                  </div>
                </div>
                {el === strongest && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                    ☆ 最強
                  </span>
                )}
                {el === weakest && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                    最弱
                  </span>
                )}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="text-gray-400">六腑</dt>
                  <dd className="text-gray-700">{c.bowel}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-gray-400">感情</dt>
                  <dd className="text-gray-700">{c.emotion}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-gray-400">身体</dt>
                  <dd className="text-gray-700">{c.body}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-gray-400">季節</dt>
                  <dd className="text-gray-700">{c.season}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-gray-400">五味</dt>
                  <dd className="text-gray-700">{c.taste}</dd>
                </div>
              </dl>

              <p className={`mt-4 rounded-lg p-3 text-sm leading-relaxed ${STATUS_NOTE[status]}`}>
                {describe(status, c)}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
