'use client'

import { useState } from 'react'
import { calculateBazi } from '@/lib/bazi/calculator'
import { analyzeWuxing } from '@/lib/wuxing/analyzer'
import { buildDiagnosis } from '@/lib/tcm/matcher'
import type { DiagnosisResult } from '@/types/tcm'
import { BirthInputForm, type BirthInputValues } from '@/components/BirthInputForm'
import { WuxingRadarChart } from '@/components/WuxingRadarChart'
import { ConstitutionCard } from '@/components/ConstitutionCard'
import { Disclaimer } from '@/components/Disclaimer'

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(values: BirthInputValues) {
    try {
      const bazi = calculateBazi({
        birthDate: values.birthDate,
        birthTime: values.birthTime,
        timezone: 'Asia/Tokyo',
      })
      const wuxing = analyzeWuxing(bazi)
      setResult(buildDiagnosis(bazi, wuxing))
      setError(null)
    } catch {
      setError('入力内容を確認してください（例: 1990-05-15 / 10:30）')
      setResult(null)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">八字体質ナビ</h1>
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

      {result && (
        <div className="mt-10 flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-bold">あなたの命式</h2>
            <table className="mt-2 w-full border-collapse text-center">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border p-2">年柱</th>
                  <th className="border p-2">月柱</th>
                  <th className="border p-2">日柱</th>
                  <th className="border p-2">時柱</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xl">
                  <td className="border p-2">
                    {result.bazi.year.stem}
                    {result.bazi.year.branch}
                  </td>
                  <td className="border p-2">
                    {result.bazi.month.stem}
                    {result.bazi.month.branch}
                  </td>
                  <td className="border p-2 font-bold">
                    {result.bazi.day.stem}
                    {result.bazi.day.branch}
                  </td>
                  <td className="border p-2">
                    {result.bazi.hour.stem}
                    {result.bazi.hour.branch}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-600">
              日主: {result.bazi.dayMaster}（{result.wuxing.dayMasterElement}） / 傾向:{' '}
              {result.wuxing.strength}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">五行バランス</h2>
            <WuxingRadarChart scores={result.wuxing.scores} />
            <p className="text-sm leading-relaxed text-gray-700">{result.wuxing.explanation}</p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">体質タイプの傾向</h2>
            <ConstitutionCard
              constitution={result.primaryConstitution}
              reasons={result.matches[0].reasons}
              isPrimary
            />
            {result.secondaryConstitution && result.matches[1] && (
              <ConstitutionCard
                constitution={result.secondaryConstitution}
                reasons={result.matches[1].reasons}
              />
            )}
          </section>

          <Disclaimer />
        </div>
      )}
    </main>
  )
}
