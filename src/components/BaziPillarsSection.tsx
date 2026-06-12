import type { BaziPillar, BaziResult, EarthlyBranch, HeavenlyStem } from '@/types/bazi'
import type { Element } from '@/types/wuxing'
import { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT } from '@/lib/bazi/constants'
import {
  STEM_READING,
  STEM_YINYANG,
  BRANCH_READING,
  HIDDEN_STEM_LABELS,
} from '@/lib/bazi/displayData'
import { ELEMENT_STYLE } from '@/lib/wuxing/elementStyle'
import { SectionHeading, KANJI_NUMERALS } from './SectionHeading'

type PillarMeta = {
  key: keyof Pick<BaziResult, 'year' | 'month' | 'day' | 'hour'>
  label: string
  role: string
  icon: string
}

const PILLARS: readonly PillarMeta[] = [
  { key: 'year', label: '年柱', role: '先祖・社会運', icon: '🌿' },
  { key: 'month', label: '月柱', role: '両親・仕事運', icon: '🌸' },
  { key: 'day', label: '日柱', role: '自己・配偶者運', icon: '☀️' },
  { key: 'hour', label: '時柱', role: '子供・晩年運', icon: '🌙' },
]

/** 五行の色付きバッジ */
function ElementBadge({ element }: { element: Element }) {
  const color = ELEMENT_STYLE[element].color
  return (
    <span
      className="rounded px-1.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: `${color}1a` }}
    >
      {element}
    </span>
  )
}

function PillarCard({
  meta,
  pillar,
  hiddenStems,
  isDayMaster,
}: {
  meta: PillarMeta
  pillar: BaziPillar
  hiddenStems: string[]
  isDayMaster: boolean
}) {
  const stem = pillar.stem as HeavenlyStem
  const branch = pillar.branch as EarthlyBranch
  const stemEl = STEM_TO_ELEMENT[stem]
  const branchEl = BRANCH_TO_ELEMENT[branch]

  return (
    <div
      className={`flex flex-col rounded-2xl border p-4 shadow-sm ${
        isDayMaster ? 'border-[#d8b65a] bg-[#fdf6e3]' : 'border-[#ece6d8] bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-bold text-gray-700">
          <span aria-hidden>{meta.icon}</span>
          {meta.label}
        </span>
        <span className="text-xs text-gray-400">{meta.role}</span>
      </div>

      {/* 天干 */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">天干</p>
        <p className="my-1 text-5xl font-bold" style={{ color: ELEMENT_STYLE[stemEl].color }}>
          {stem}
        </p>
        <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
          {STEM_READING[stem]}
          <ElementBadge element={stemEl} />
          {STEM_YINYANG[stem]}
        </p>
      </div>

      <div className="my-2 border-t border-dashed border-gray-200" />

      {/* 地支 */}
      <div className="text-center">
        <p className="text-xs text-gray-400">地支</p>
        <p className="my-1 text-5xl font-bold" style={{ color: ELEMENT_STYLE[branchEl].color }}>
          {branch}
        </p>
        <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
          {BRANCH_READING[branch]}
          <ElementBadge element={branchEl} />
        </p>
      </div>

      <div className="my-2 border-t border-dashed border-gray-200" />

      {/* 蔵干 */}
      <div>
        <p className="mb-1 text-center text-xs text-gray-400">蔵干</p>
        <ul className="flex flex-col gap-1">
          {hiddenStems.map((hs, i) => {
            const el = STEM_TO_ELEMENT[hs as HeavenlyStem]
            return (
              <li key={hs} className="flex items-center justify-between text-sm">
                <span className="text-xs text-gray-400">{HIDDEN_STEM_LABELS[i]}</span>
                <span className="font-bold text-gray-700">{hs}</span>
                <ElementBadge element={el} />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/** 命式（四柱）セクション */
export function BaziPillarsSection({ bazi }: { bazi: BaziResult }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading
        numberKanji={KANJI_NUMERALS[0]}
        title="命式（四柱）"
        subtitle="あなたの生年月日・時刻から算出した干支の組み合わせ"
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PILLARS.map((meta) => (
          <PillarCard
            key={meta.key}
            meta={meta}
            pillar={bazi[meta.key]}
            hiddenStems={bazi.hiddenStems[meta.key]}
            isDayMaster={meta.key === 'day'}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500">
        ☀️ 日柱の天干が「日干（命主）」＝あなたの命式の主人公となる干
      </p>
    </section>
  )
}
