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

const ELEMENT_ORDER: readonly Element[] = ['木', '火', '土', '金', '水'] as const

type Props = {
  scores: WuxingAnalysis['scores']
}

/** 五行バランスのレーダーチャート */
export function WuxingRadarChart({ scores }: Props) {
  const data = ELEMENT_ORDER.map((el) => ({ element: el, score: scores[el] }))
  const max = Math.max(...ELEMENT_ORDER.map((el) => scores[el]), 1)

  return (
    <div className="h-72 w-full" data-testid="wuxing-radar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="element" />
          <PolarRadiusAxis domain={[0, Math.ceil(max)]} tickCount={4} />
          <Radar
            name="五行スコア"
            dataKey="score"
            stroke="#047857"
            fill="#10b981"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
