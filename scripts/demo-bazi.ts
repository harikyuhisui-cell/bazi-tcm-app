/**
 * 命式算出エンジンの動作確認スクリプト
 * 実行: npx tsx scripts/demo-bazi.ts
 */
import { calculateBazi } from '../src/lib/bazi/calculator'

const samples = [
  { label: '通常ケース', birthDate: '1990-05-15', birthTime: '10:30' },
  { label: '立春前', birthDate: '1990-02-03', birthTime: '12:00' },
  { label: '子の刻（23時台）', birthDate: '1990-05-15', birthTime: '23:30' },
  { label: '閏年', birthDate: '2000-02-29', birthTime: '12:00' },
]

for (const s of samples) {
  const r = calculateBazi({ birthDate: s.birthDate, birthTime: s.birthTime, timezone: 'Asia/Tokyo' })
  console.log(`\n■ ${s.label}（${s.birthDate} ${s.birthTime}）`)
  console.log(`  年柱: ${r.year.stem}${r.year.branch}  月柱: ${r.month.stem}${r.month.branch}  日柱: ${r.day.stem}${r.day.branch}  時柱: ${r.hour.stem}${r.hour.branch}`)
  console.log(`  日主: ${r.dayMaster}`)
  console.log(
    `  蔵干: 年[${r.hiddenStems.year.join(',')}] 月[${r.hiddenStems.month.join(',')}] 日[${r.hiddenStems.day.join(',')}] 時[${r.hiddenStems.hour.join(',')}]`
  )
}
