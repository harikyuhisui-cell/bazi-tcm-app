import type { WuxingAnalysis } from '@/types/wuxing'
import { dayMasterSupportPercent } from '@/lib/wuxing/analyzer'
import { STRENGTH_THRESHOLDS } from '@/lib/wuxing/rules'

type Props = {
  analysis: WuxingAnalysis
}

const WEAK = Math.round(STRENGTH_THRESHOLDS.weak * 100)
const STRONG = Math.round(STRENGTH_THRESHOLDS.strong * 100)

/** 日主グループ比率（身強・身弱）のバー */
export function DayMasterStrengthBar({ analysis }: Props) {
  const percent = dayMasterSupportPercent(analysis)
  const caption =
    analysis.strength === '身強'
      ? `日主の気が充実しています（${percent}%）`
      : analysis.strength === '身弱'
        ? `日主の気がやや控えめです（${percent}%）`
        : `日主の気はバランスが取れています（${percent}%）`

  return (
    <div className="rounded-xl border border-[#e7e1d4] bg-[#faf6ec] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">日主グループ比率</span>
        <span className="text-lg font-bold text-[#a9823a]">{analysis.strength}</span>
      </div>

      <div className="relative mt-4 h-3 rounded-full bg-gray-200">
        {/* 身弱・身強の境界帯 */}
        <span
          className="absolute inset-y-0 rounded-full bg-[#d8b65a]/30"
          style={{ left: `${WEAK}%`, right: `${100 - STRONG}%` }}
        />
        {/* 充実度の塗り */}
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-[#c9a227]"
          style={{ width: `${percent}%` }}
        />
        {/* 現在位置マーカー */}
        <span
          className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-[#8a6d20]"
          style={{ left: `${percent}%` }}
        />
      </div>

      <div className="relative mt-1 h-4 text-xs text-gray-400">
        <span className="absolute left-0">0%</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${WEAK}%` }}>
          身弱│{WEAK}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${STRONG}%` }}>
          {STRONG}│身強
        </span>
        <span className="absolute right-0">100%</span>
      </div>

      <p className="mt-3 text-center text-sm text-gray-600">{caption}</p>
    </div>
  )
}
