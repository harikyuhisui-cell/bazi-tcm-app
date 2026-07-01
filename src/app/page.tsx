'use client'

import { useEffect, useRef, useState } from 'react'
import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import { buildDiagnosis } from '@/lib/tcm/matcher'
import type { DiagnosisResult } from '@/types/tcm'
import { BirthInputForm, type BirthInputValues } from '@/components/BirthInputForm'
import type { Gender } from '@/lib/tcm/gender'
import { BaziPillarsSection } from '@/components/BaziPillarsSection'
import { WuxingAnalysisSection } from '@/components/WuxingAnalysisSection'
import { OrganProfileSection } from '@/components/OrganProfileSection'
import { PersonalityCard } from '@/components/PersonalityCard'
import { SectionHeading, KANJI_NUMERALS } from '@/components/SectionHeading'
import { ConstitutionCard } from '@/components/ConstitutionCard'
import { Disclaimer } from '@/components/Disclaimer'

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [profile, setProfile] = useState<{ name: string; gender: Gender } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!result || !profile) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result, profile])

  function handleSubmit(values: BirthInputValues) {
    try {
      const bazi = calculateBazi({
        birthDate: values.birthDate,
        birthTime: values.birthTime,
        timezone: 'Asia/Tokyo',
      })
      const wuxing = analyzeWuxing(bazi)
      setResult(buildDiagnosis(bazi, wuxing, values.symptomIds, values.familyIds))
      setProfile({ name: values.name, gender: values.gender })
      setError(null)
    } catch {
      setError('入力内容を確認してください（例: 1990-05-15 / 10:30）')
      setResult(null)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">陰陽五行体質チェック</h1>
      <p className="mt-2 text-sm text-gray-600">
        生年月日時から四柱推命の命式を算出し、東洋医学の観点から体質の傾向と養生のヒントをご提案します。
      </p>

      <div className="mt-6">
        <BirthInputForm onSubmit={handleSubmit} />
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {result && profile && (
        <div ref={resultRef} className="mt-10 flex scroll-mt-6 flex-col gap-10">
          {profile.name && (
            <p className="text-lg font-bold text-gray-700">{profile.name} さんの鑑定結果</p>
          )}
          <BaziPillarsSection bazi={result.bazi} />

          <WuxingAnalysisSection analysis={result.wuxing} sectionIndex={1} />

          <OrganProfileSection analysis={result.wuxing} sectionIndex={2} />

          <section className="flex flex-col gap-5">
            <SectionHeading
              numberKanji={KANJI_NUMERALS[3]}
              title="性格の傾向"
              subtitle="日主の五行から見た気質の傾向"
            />
            <PersonalityCard
              dayMaster={result.bazi.dayMaster}
              dayMasterElement={result.wuxing.dayMasterElement}
            />
          </section>

          <section className="flex flex-col gap-5">
            <SectionHeading
              numberKanji={KANJI_NUMERALS[4]}
              title="体質タイプの傾向"
              subtitle="五行バランス・自覚症状・家族歴から推定される体質（最大4タイプ）"
            />
            {result.constitutions.map((rc, i) => (
              <ConstitutionCard
                key={rc.constitution.id}
                constitution={rc.constitution}
                reasons={rc.reasons}
                rank={i + 1}
                gender={profile.gender}
                defaultOpen={i === 0}
              />
            ))}
          </section>

          <Disclaimer />
        </div>
      )}
    </main>
  )
}
