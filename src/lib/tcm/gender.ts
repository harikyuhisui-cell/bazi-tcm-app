/** 性別（婦人科系アドバイスの出し分けに使用） */
export type Gender = 'female' | 'male'

/** 婦人科系（女性特有）の内容を示すキーワード */
const GYNECOLOGICAL_KEYWORDS = ['月経', '経血', '生理', '婦人科', '女性の場合']

/** テキストが婦人科系（女性特有）の内容かどうか */
export function isGynecological(text: string): boolean {
  return GYNECOLOGICAL_KEYWORDS.some((kw) => text.includes(kw))
}

/**
 * 性別に応じてテキスト項目を絞り込む。
 * 男性の場合、婦人科系（月経・婦人科など）の項目を除外する。
 */
export function filterByGender<T>(
  items: readonly T[],
  gender: Gender,
  toText: (item: T) => string
): T[] {
  if (gender === 'female') return [...items]
  return items.filter((item) => !isGynecological(toText(item)))
}
