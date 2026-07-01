'use client'

import { FAMILY_HISTORY_ITEMS } from '@/lib/tcm/familyHistory'

type Props = {
  checkedIds: string[]
  onChange: (checkedIds: string[]) => void
}

/**
 * 遺伝性体質チェックリスト（血縁者の体質傾向）。
 * ※遺伝・発症を断定せず、体質傾向の参考として診断に加味する。
 */
export function FamilyHistoryChecklist({ checkedIds, onChange }: Props) {
  const checked = new Set(checkedIds)

  function toggle(id: string) {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(Array.from(next))
  }

  return (
    <fieldset className="rounded-2xl border border-[#eadfcd] bg-[#fffaf3]/80 p-4 shadow-sm">
      <legend className="rounded-full border border-[#eadfcd] bg-[#fffaf3] px-3 py-1 text-sm font-medium text-[#4a332d]">
        ご家族の体質（任意・血縁者に当てはまるものにチェック）
      </legend>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
        <p className="text-xs text-gray-500">
          遺伝性の傾向を体質の参考に加味します（病気の診断ではありません）。
        </p>
        <span className="text-xs font-medium text-[#c46d82]">
          {checked.size > 0 ? `${checked.size}件選択中` : `全${FAMILY_HISTORY_ITEMS.length}項目`}
        </span>
      </div>

      <div className="relative">
        <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto pb-6 pr-1 sm:max-h-64 sm:grid-cols-2">
          {FAMILY_HISTORY_ITEMS.map((item) => (
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
