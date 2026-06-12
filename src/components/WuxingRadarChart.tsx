'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { Element, WuxingAnalysis } from '@/types/wuxing'
import { ELEMENT_STYLE, ELEMENT_ORDER } from '@/lib/wuxing/elementStyle'

type Props = {
  scores: WuxingAnalysis['scores']
}

type TickProps = {
  payload: { value: Element }
  x: number
  y: number
  cx: number
  cy: number
}

/** 五行＋五臓を色付きで描くカスタム軸ラベル */
function ElementTick({ payload, x, y, cx, cy }: TickProps) {
  const el = payload.value
  const style = ELEMENT_STYLE[el]
  const dx = x - cx
  const dy = y - cy
  return (
    <g transform={`translate(${x + dx * 0.08}, ${y + dy * 0.08})`}>
      <text textAnchor="middle" dy={-2} fontSize={20} fontWeight={700} fill={style.color}>
        {el}
      </text>
      <text textAnchor="middle" dy={16} fontSize={11} fill="#9ca3af">
        {style.organ}
      </text>
    </g>
  )
}

/** 五行バランスのレーダーチャート */
export function WuxingRadarChart({ scores }: Props) {
  const data = ELEMENT_ORDER.map((el) => ({ element: el, score: scores[el] }))
  const max = Math.max(...ELEMENT_ORDER.map((el) => scores[el]), 1)

  return (
    <div data-testid="wuxing-radar-chart">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 24, right: 24, bottom: 24, left: 24 }}>
            <PolarGrid stroke="#e7e1d4" />
            <PolarAngleAxis
              dataKey="element"
              tick={(props) => <ElementTick {...(props as unknown as TickProps)} />}
            />
            <PolarRadiusAxis
              domain={[0, Math.ceil(max)]}
              tickCount={4}
              tick={{ fontSize: 10, fill: '#b9b09a' }}
              axisLine={false}
            />
            <Radar
              name="五行スコア"
              dataKey="score"
              stroke="#c9a227"
              strokeWidth={2}
              fill="#d8b65a"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
        {ELEMENT_ORDER.map((el) => (
          <li key={el} className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ELEMENT_STYLE[el].color }}
            />
            {el}/{ELEMENT_STYLE[el].organ}
          </li>
        ))}
      </ul>
    </div>
  )
}
