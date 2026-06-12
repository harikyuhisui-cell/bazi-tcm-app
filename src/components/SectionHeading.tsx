type Props = {
  /** セクション番号（漢数字バッジ） */
  numberKanji: string
  title: string
  subtitle?: string
}

/** 漢数字バッジ付きのセクション見出し */
export function SectionHeading({ numberKanji, title, subtitle }: Props) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="select-none text-5xl font-bold leading-none text-[#d8cdb4]"
      >
        {numberKanji}
      </span>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  )
}

/** 漢数字（formal）1〜8 */
export const KANJI_NUMERALS = ['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌'] as const
