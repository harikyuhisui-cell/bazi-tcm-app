'use client'

import { useState } from 'react'
import type { ConstitutionType } from '@/types/constitution'
import { filterByGender, type Gender } from '@/lib/tcm/gender'

type Props = {
  constitution: ConstitutionType
  /** 判定根拠（マッチャーの reasons） */
  reasons: string[]
  /** 候補の順位（1始まり） */
  rank: number
  /** 性別（男性は婦人科系のサインを非表示） */
  gender: Gender
  /** 初期状態で詳細を開くか */
  defaultOpen?: boolean
}

/** 順位に応じたラベル */
function rankLabel(rank: number): string {
  return rank === 1 ? '最も近い傾向' : `${rank}番目に近い傾向`
}

/** 体質タイプの結果カード（概要を表示し、詳細はプルダウンで開閉） */
export function ConstitutionCard({
  constitution,
  reasons,
  rank,
  gender,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const isPrimary = rank === 1
  const warningSignals = filterByGender(constitution.warningSignals, gender, (w) => w)
  const detailId = `constitution-detail-${constitution.id}`

  return (
    <section
      className={`rounded-lg border p-5 ${isPrimary ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300 bg-white'}`}
    >
      <p className="text-xs text-gray-500">{rankLabel(rank)}</p>
      <h3 className="mt-1 text-xl font-bold">
        {constitution.name}
        <span className="ml-2 text-sm font-normal text-gray-500">{constitution.nameKana}</span>
      </h3>
      <p className="mt-2 text-sm leading-relaxed">{constitution.shortDescription}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailId}
        className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-900"
      >
        {open ? '詳しい内容を閉じる' : '詳しい内容を見る'}
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id={detailId} className="mt-3 border-t border-gray-200 pt-3">
          <div>
            <h4 className="text-sm font-semibold">この傾向と判定した理由</h4>
            <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
              {reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold">おすすめの食材</h4>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                {constitution.foodTherapy.recommend.slice(0, 3).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">セルフケアにおすすめのツボ</h4>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                {constitution.recommendedAcupoints.slice(0, 3).map((p) => (
                  <li key={p.code}>
                    {p.name}（{p.code}）
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-red-50 p-3">
            <h4 className="text-sm font-semibold text-red-800">受診をおすすめするサイン</h4>
            <ul className="mt-1 list-inside list-disc text-sm text-red-700">
              {warningSignals.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
