import type { Element } from '@/types/wuxing'
import { ELEMENT_STYLE, ELEMENT_CORRESPONDENCE } from '@/lib/wuxing/elementStyle'

/** 各五行のエネルギーの性質（表示用・2行に分割） */
const ENERGY: Record<Element, [string, string]> = {
  木: ['成長・発展の', 'エネルギー'],
  火: ['情熱・活力・', '上昇のエネルギー'],
  土: ['安定・調和・', '受容のエネルギー'],
  金: ['収縮・整理・', '変化のエネルギー'],
  水: ['滋養・蓄える・', '静のエネルギー'],
}

const CENTER = { x: 320, y: 330 }
const R = 210 // 各円の中心までの半径
const CIRCLE_R = 62

/** 五角形の頂点（上＝木から時計回り） */
const POS: Record<Element, { x: number; y: number }> = (() => {
  const order: Element[] = ['木', '火', '土', '金', '水']
  const result = {} as Record<Element, { x: number; y: number }>
  order.forEach((el, i) => {
    const theta = (i * 72 * Math.PI) / 180
    result[el] = {
      x: CENTER.x + R * Math.sin(theta),
      y: CENTER.y - R * Math.cos(theta),
    }
  })
  return result
})()

const SHENG_COLOR = '#6b8e23' // 相生（実線）
const KE_COLOR = '#a9a96a' // 相剋（破線）

type Edge = { from: Element; to: Element; label: string[] }

/** 相生（生み出す）: 五角形の外周を時計回り */
const SHENG: Edge[] = [
  { from: '水', to: '木', label: ['水は木を育てる'] },
  { from: '木', to: '火', label: ['木は燃えて', '火を生む'] },
  { from: '火', to: '土', label: ['火は燃えて', '灰（土）を生む'] },
  { from: '土', to: '金', label: ['土の中から', '金（鉱物）が生まれる'] },
  { from: '金', to: '水', label: ['金は表面に', '水を生じさせる'] },
]

/** 相剋（抑える）: 星形の対角線 */
const KE: Edge[] = [
  { from: '水', to: '火', label: ['水は火を消す'] },
  { from: '火', to: '金', label: ['火は金属を溶かす'] },
  { from: '金', to: '木', label: ['金は木を切り倒す'] },
  { from: '木', to: '土', label: ['木は土の養分を', '奪いすぎる'] },
  { from: '土', to: '水', label: ['土は水をせき止める'] },
]

/** 線を円の縁で止めるために両端を半径ぶん短縮する */
function trim(from: Element, to: Element, gap = CIRCLE_R + 4) {
  const a = POS[from]
  const b = POS[to]
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  return {
    x1: a.x + ux * gap,
    y1: a.y + uy * gap,
    x2: b.x - ux * gap,
    y2: b.y - uy * gap,
  }
}

/** 五行の相生・相剋関係図 */
export function WuxingCycleDiagram() {
  return (
    <div className="rounded-2xl border border-[#ece6d8] bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-base font-bold text-gray-700">五行の相生・相剋</h3>
      <p className="mb-3 text-sm text-gray-500">
        五行は互いに「生み出す（相生）」「抑える（相剋）」関係でつながっています
      </p>

      {/* 凡例 */}
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <svg width="28" height="10" aria-hidden>
            <line x1="0" y1="5" x2="28" y2="5" stroke={SHENG_COLOR} strokeWidth="2" />
          </svg>
          相生（そうせい）＝助け合い生み出す
        </span>
        <span className="flex items-center gap-1">
          <svg width="28" height="10" aria-hidden>
            <line
              x1="0"
              y1="5"
              x2="28"
              y2="5"
              stroke={KE_COLOR}
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
          相剋（そうこく）＝制約し抑える
        </span>
      </div>

      <svg
        viewBox="0 0 640 660"
        className="h-auto w-full"
        role="img"
        aria-label="五行の相生・相剋の関係図"
      >
        <defs>
          <marker
            id="arrow-sheng"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={SHENG_COLOR} />
          </marker>
          <marker
            id="arrow-ke"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={KE_COLOR} />
          </marker>
        </defs>

        {/* 中央ラベル */}
        <text
          x={CENTER.x}
          y={CENTER.y - 6}
          textAnchor="middle"
          fontSize="20"
          fill="#9a7b3a"
          fontWeight="bold"
        >
          相剋
        </text>
        <text x={CENTER.x} y={CENTER.y + 14} textAnchor="middle" fontSize="11" fill="#b9a98a">
          （そうこく）
        </text>

        {/* 相剋（破線）: 円の背面に描く */}
        {KE.map((e) => {
          const t = trim(e.from, e.to)
          const mx = t.x1 + (t.x2 - t.x1) * 0.32
          const my = t.y1 + (t.y2 - t.y1) * 0.32
          return (
            <g key={`ke-${e.from}-${e.to}`}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={KE_COLOR}
                strokeWidth="1.5"
                strokeDasharray="5 4"
                markerEnd="url(#arrow-ke)"
              />
              <text x={mx} y={my} textAnchor="middle" fontSize="11" fill="#7d7d52">
                {e.label.map((line, i) => (
                  <tspan key={line} x={mx} dy={i === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}

        {/* 相生（実線）: 外周 */}
        {SHENG.map((e) => {
          const t = trim(e.from, e.to)
          const mx = (t.x1 + t.x2) / 2
          const my = (t.y1 + t.y2) / 2
          // 中心から外向きにラベルをずらす
          const ox = mx - CENTER.x
          const oy = my - CENTER.y
          const olen = Math.hypot(ox, oy)
          const lx = mx + (ox / olen) * 26
          const ly = my + (oy / olen) * 26
          return (
            <g key={`sheng-${e.from}-${e.to}`}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={SHENG_COLOR}
                strokeWidth="2"
                markerEnd="url(#arrow-sheng)"
              />
              <text x={lx} y={ly} textAnchor="middle" fontSize="11" fill={SHENG_COLOR}>
                {e.label.map((line, i) => (
                  <tspan key={line} x={lx} dy={i === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}

        {/* 五行の円 */}
        {(Object.keys(POS) as Element[]).map((el) => {
          const p = POS[el]
          const color = ELEMENT_STYLE[el].color
          const c = ELEMENT_CORRESPONDENCE[el]
          return (
            <g key={el}>
              <circle cx={p.x} cy={p.y} r={CIRCLE_R} fill={`${color}1f`} stroke={color} strokeWidth="2" />
              <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="30" fontWeight="bold" fill={color}>
                {el}
              </text>
              <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize="12" fill="#555">
                [{c.organ}・{c.bowel}]
              </text>
              <text x={p.x} y={p.y + 26} textAnchor="middle" fontSize="9.5" fill="#888">
                <tspan x={p.x}>{ENERGY[el][0]}</tspan>
                <tspan x={p.x} dy="12">
                  {ENERGY[el][1]}
                </tspan>
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
