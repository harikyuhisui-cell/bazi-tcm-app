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
        <span className="text-lg font-bold text-[#c46d82]">{analysis.strength}</span>
      </div>

      <div className="relative mt-4 h-5 rounded-full bg-gray-200">
        {/* 身弱・身強の境界帯 */}
        <span
          className="absolute inset-y-0 rounded-full bg-[#f6cbd5]/45"
          style={{ left: `${WEAK}%`, right: `${100 - STRONG}%` }}
        />
        {/* 充実度の塗り */}
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${percent}%`,
            backgroundImage:
              'repeating-linear-gradient(135deg, #eaa8b8 0 8px, #fff7fa 8px 14px)',
          }}
        />
        {/* 現在位置マーカー */}
        <span
          className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded bg-[#c46d82]"
          style={{ left: `${percent}%` }}
        />
      </div>

      <div className="relative mt-2 h-4 text-[10px] text-gray-500 sm:text-xs">
        <span className="absolute left-0">最身弱</span>
        <span className="absolute -translate-x-1/2" style={{ left: '22%' }}>
          身弱
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: '43%' }}>
          中和
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: '64%' }}>
          身強
        </span>
        <span className="absolute right-0">最身強</span>
      </div>

      <p className="mt-3 text-center text-sm text-gray-600">{caption}</p>
    </div>
  )
}
