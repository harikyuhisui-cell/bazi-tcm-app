import type { Element } from '@/types/wuxing'
import { PERSONALITY_BY_DAY_MASTER } from '@/lib/bazi/personality'

type Props = {
  dayMaster: string
  dayMasterElement: Element
}

/** 日主の五行に基づく性格傾向カード */
export function PersonalityCard({ dayMaster, dayMasterElement }: Props) {
  const profile = PERSONALITY_BY_DAY_MASTER[dayMasterElement]

  return (
    <section className="rounded-lg border border-gray-300 bg-white p-5">
      <p className="text-xs text-gray-500">
        日主 {dayMaster}（{dayMasterElement}）から見た性格傾向
      </p>
      <h3 className="mt-1 text-lg font-bold">{profile.keyword}</h3>
      <ul className="mt-2 list-inside list-disc text-sm leading-relaxed text-gray-700">
        {profile.traits.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}
