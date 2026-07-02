import type { Element, WuxingAnalysis } from '@/types/wuxing'
import { ELEMENT_STYLE, ELEMENT_ORDER } from '@/lib/wuxing/elementStyle'

type Props = {
  analysis: WuxingAnalysis
}

/** 五行スコアの詳細（色付き横棒・全体比率・喜神/忌神バッジ） */
export function WuxingScoreDetail({ analysis }: Props) {
  const { scores, favorableElements, unfavorableElements } = analysis
  const total = ELEMENT_ORDER.reduce((sum, el) => sum + scores[el], 0)
  const max = Math.max(...ELEMENT_ORDER.map((el) => scores[el]), 1)

  const tagOf = (el: Element): 'favorable' | 'unfavorable' | null => {
    if (favorableElements.includes(el)) return 'favorable'
    if (unfavorableElements.includes(el)) return 'unfavorable'
    return null
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {ELEMENT_ORDER.map((el) => {
          const style = ELEMENT_STYLE[el]
          const ratio = total === 0 ? 0 : Math.round((scores[el] / total) * 100)
          const barWidth = `${(scores[el] / max) * 100}%`
          const tag = tagOf(el)
          return (
            <li key={el} className="flex items-center gap-2 sm:gap-3">
              <span className="flex w-8 shrink-0 items-baseline gap-0.5 sm:w-10 sm:gap-1">
                <span className="text-xl font-bold" style={{ color: style.color }}>
                  {el}
                </span>
                <span className="text-xs text-gray-400">{style.organ}</span>
              </span>
              <span className="relative h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: barWidth, backgroundColor: style.color }}
                />
              </span>
              <span className="w-6 shrink-0 text-right text-xs font-medium text-gray-700 sm:w-8 sm:text-sm">
                {scores[el]}
              </span>
              <span className="w-8 shrink-0 text-right text-xs text-gray-500 sm:w-10 sm:text-sm">
                {ratio}%
              </span>
              <span className="w-10 shrink-0 text-center sm:w-12">
                {tag === 'favorable' && (
                  <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] text-emerald-700 sm:px-1.5 sm:text-xs">
                    喜神
                  </span>
                )}
                {tag === 'unfavorable' && (
                  <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] text-red-700 sm:px-1.5 sm:text-xs">
                    忌神
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap text-[10px] text-gray-500 sm:gap-4 sm:text-xs">
        <span className="shrink-0">
          <span className="mr-1 rounded bg-emerald-100 px-1 py-0.5 text-emerald-700 sm:px-1.5">喜神</span>
          養うべき五行
        </span>
        <span className="shrink-0">
          <span className="mr-1 rounded bg-red-100 px-1 py-0.5 text-red-700 sm:px-1.5">忌神</span>
          注意すべき五行
        </span>
      </div>
    </div>
  )
}
