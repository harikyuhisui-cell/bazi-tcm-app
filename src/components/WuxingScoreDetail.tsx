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
            <li key={el} className="flex items-center gap-3">
              <span className="flex w-10 shrink-0 items-baseline gap-1">
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
              <span className="w-8 shrink-0 text-right text-sm font-medium text-gray-700">
                {scores[el]}
              </span>
              <span className="w-10 shrink-0 text-right text-sm text-gray-500">{ratio}%</span>
              <span className="w-12 shrink-0 text-center">
                {tag === 'favorable' && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                    喜神
                  </span>
                )}
                {tag === 'unfavorable' && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                    忌神
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex justify-end gap-4 text-xs text-gray-500">
        <span>
          <span className="mr-1 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">喜神</span>
          養うべき五行
        </span>
        <span>
          <span className="mr-1 rounded bg-red-100 px-1.5 py-0.5 text-red-700">忌神</span>
          注意すべき五行
        </span>
      </div>
    </div>
  )
}
