/**
 * 生年月日入力 → 命式算出 → 五行バランス分析の通し動作確認
 * 実行: npx tsx scripts/demo-wuxing.ts [YYYY-MM-DD] [HH:mm]
 */
import { calculateBazi } from '../src/lib/bazi/calculator'
import { analyzeWuxing } from '../src/lib/wuxing/analyzer'

const birthDate = process.argv[2] ?? '1990-05-15'
const birthTime = process.argv[3] ?? '10:30'

const bazi = calculateBazi({ birthDate, birthTime, timezone: 'Asia/Tokyo' })
const analysis = analyzeWuxing(bazi)

console.log(`\n=== 五行バランス分析（${birthDate} ${birthTime} 生まれ）===\n`)
console.log(
  `命式: 年柱 ${bazi.year.stem}${bazi.year.branch} / 月柱 ${bazi.month.stem}${bazi.month.branch} / 日柱 ${bazi.day.stem}${bazi.day.branch} / 時柱 ${bazi.hour.stem}${bazi.hour.branch}`
)
console.log(`日主: ${bazi.dayMaster}（${analysis.dayMasterElement}）\n`)

console.log('五行スコア:')
for (const [el, score] of Object.entries(analysis.scores)) {
  const bar = '█'.repeat(Math.round(score * 2))
  console.log(`  ${el}: ${String(score).padStart(4)} ${bar}`)
}

console.log(`\n強弱判定: ${analysis.strength}`)
console.log(`喜神: ${analysis.favorableElements.join('・')}`)
console.log(`忌神: ${analysis.unfavorableElements.join('・')}`)
console.log(`最強の五臓対応: ${analysis.dominantOrgan} / 最弱: ${analysis.weakestOrgan}`)
console.log(`\n${analysis.explanation}`)
