import type { WuxingAnalysis } from '@/types/wuxing'
import { SectionHeading, KANJI_NUMERALS } from './SectionHeading'
import { WuxingRadarChart } from './WuxingRadarChart'
import { WuxingScoreDetail } from './WuxingScoreDetail'
import { DayMasterStrengthBar } from './DayMasterStrengthBar'
import { WuxingCycleDiagram } from './WuxingCycleDiagram'

type Props = {
  analysis: WuxingAnalysis
  /** セクション番号（0始まり）。既定は2（貳） */
  sectionIndex?: number
}

const cardClass = 'rounded-2xl border border-[#ece6d8] bg-white p-6 shadow-sm'

/** 五行バランス分析セクション（レーダー＋スコア詳細＋日主グループ比率） */
export function WuxingAnalysisSection({ analysis, sectionIndex = 1 }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading
        numberKanji={KANJI_NUMERALS[sectionIndex]}
        title="五行バランス分析"
        subtitle="命式に内包される五行の勢力と東洋医学的な体質への影響"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className={cardClass}>
          <h3 className="mb-2 text-center text-base font-bold text-gray-700">
            五行バランスチャート
          </h3>
          <WuxingRadarChart scores={analysis.scores} />
        </div>
        <div className={cardClass}>
          <h3 className="mb-4 text-base font-bold text-gray-700">五行スコア詳細</h3>
          <WuxingScoreDetail analysis={analysis} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <WuxingCycleDiagram />
      </div>

      <DayMasterStrengthBar analysis={analysis} />

      <p className="text-sm leading-relaxed text-gray-600">{analysis.explanation}</p>
    </section>
  )
}
