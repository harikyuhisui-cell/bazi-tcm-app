import type { ConstitutionType } from '@/types/constitution'

type Props = {
  constitution: ConstitutionType
  /** 判定根拠（マッチャーの reasons） */
  reasons: string[]
  /** 第一候補なら true */
  isPrimary?: boolean
}

/** 体質タイプの結果カード */
export function ConstitutionCard({ constitution, reasons, isPrimary = false }: Props) {
  return (
    <section
      className={`rounded-lg border p-5 ${isPrimary ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300 bg-white'}`}
    >
      <p className="text-xs text-gray-500">{isPrimary ? '最も近い傾向' : '次に近い傾向'}</p>
      <h3 className="mt-1 text-xl font-bold">
        {constitution.name}
        <span className="ml-2 text-sm font-normal text-gray-500">{constitution.nameKana}</span>
      </h3>
      <p className="mt-2 text-sm leading-relaxed">{constitution.shortDescription}</p>

      <div className="mt-3">
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
          {constitution.warningSignals.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
