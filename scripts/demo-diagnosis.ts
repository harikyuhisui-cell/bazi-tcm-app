/**
 * 生年月日入力 → 命式 → 五行分析 → 体質タイプ推定の通し動作確認
 * 実行: npx tsx scripts/demo-diagnosis.ts [YYYY-MM-DD] [HH:mm]
 */
import { calculateBazi } from '../src/lib/bazi/calculator'
import { analyzeWuxing } from '../src/lib/wuxing/analyzer'
import { buildDiagnosis } from '../src/lib/tcm/matcher'

const birthDate = process.argv[2] ?? '1990-05-15'
const birthTime = process.argv[3] ?? '10:30'

const bazi = calculateBazi({ birthDate, birthTime, timezone: 'Asia/Tokyo' })
const wuxing = analyzeWuxing(bazi)
const result = buildDiagnosis(bazi, wuxing)

console.log(`\n=== 体質傾向の通し確認（${birthDate} ${birthTime} 生まれ）===\n`)
console.log(
  `命式: ${bazi.year.stem}${bazi.year.branch} ${bazi.month.stem}${bazi.month.branch} ${bazi.day.stem}${bazi.day.branch} ${bazi.hour.stem}${bazi.hour.branch} / 日主 ${bazi.dayMaster}（${wuxing.dayMasterElement}・${wuxing.strength}）`
)
console.log(
  `五行: ${Object.entries(wuxing.scores)
    .map(([el, s]) => `${el}${s}`)
    .join(' ')}\n`
)

result.matches.forEach((m, i) => {
  const c = i === 0 ? result.primaryConstitution : result.secondaryConstitution!
  console.log(`【${i === 0 ? '第一候補' : '第二候補'}】${c.name}（${c.nameKana}） score=${m.score}`)
  for (const r of m.reasons) console.log(`  根拠: ${r}`)
  console.log(`  概要: ${c.shortDescription.slice(0, 60)}…`)
  console.log()
})

console.log(
  '※本結果は占術・東洋医学の考え方に基づく参考情報であり、医療診断ではありません。'
)
