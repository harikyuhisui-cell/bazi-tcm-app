'use client'

import { visibleSymptomItems } from '@/lib/tcm/symptoms'
import type { Gender } from '@/lib/tcm/gender'

type Props = {
  /** チェック済みの症状ID */
  checkedIds: string[]
  onChange: (checkedIds: string[]) => void
  /** 性別（男性は婦人科系の項目を非表示） */
  gender: Gender
}

/**
 * 不調チェックリスト。
 * 鍼灸師監修済みの physicalTraits を項目として提示し、自覚症状を任意入力できる。
 */
export function SymptomChecklist({ checkedIds, onChange, gender }: Props) {
  const checked = new Set(checkedIds)
  const items = visibleSymptomItems(gender)

  function toggle(id: string) {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(Array.from(next))
  }

  return (
    <fieldset className="rounded-2xl border border-[#eadfcd] bg-[#fffaf3]/80 p-4 shadow-sm">
      <legend className="rounded-full border border-[#eadfcd] bg-[#fffaf3] px-3 py-1 text-sm font-medium text-[#4a332d]">
        気になる不調（任意・当てはまるものにチェック）
      </legend>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
        <p className="text-xs text-gray-500">
          チェックした内容は、命式から推定した傾向に加味されます。
        </p>
        <span className="text-xs font-medium text-[#c46d82]">
          {checked.size > 0 ? `${checked.size}件選択中` : `全${items.length}項目`}
        </span>
      </div>

      {/* スクロール領域: 下端のフェードと矢印で「続きがある」ことを示す */}
      <div className="relative">
        <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto pb-6 pr-1 sm:max-h-64 sm:grid-cols-2">
          {items.map((item) => (
            <label key={item.id} className="flex items-start gap-2 rounded-md px-1 py-0.5 text-sm hover:bg-white/55">
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#efb7c4]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-8 items-end justify-center bg-gradient-to-t from-[#fffaf3] to-transparent">
          <span className="text-xs text-gray-500">▼ スクロールで続きを表示</span>
        </div>
      </div>
    </fieldset>
  )
}
