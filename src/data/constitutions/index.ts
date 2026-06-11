import type { ConstitutionType } from '@/types/constitution'
import { liverQiStagnation } from './liver-qi-stagnation'
import { heartFire } from './heart-fire'
import { spleenDeficiency } from './spleen-deficiency'
import { lungQiDeficiency } from './lung-qi-deficiency'
import { kidneyYinDeficiency } from './kidney-yin-deficiency'
import { kidneyYangDeficiency } from './kidney-yang-deficiency'
import { qiBloodDeficiency } from './qi-blood-deficiency'
import { phlegmBloodStasis } from './phlegm-blood-stasis'

export {
  liverQiStagnation,
  heartFire,
  spleenDeficiency,
  lungQiDeficiency,
  kidneyYinDeficiency,
  kidneyYangDeficiency,
  qiBloodDeficiency,
  phlegmBloodStasis,
}

/** 全体質タイプの一覧 */
export const ALL_CONSTITUTIONS: readonly ConstitutionType[] = [
  liverQiStagnation,
  heartFire,
  spleenDeficiency,
  lungQiDeficiency,
  kidneyYinDeficiency,
  kidneyYangDeficiency,
  qiBloodDeficiency,
  phlegmBloodStasis,
] as const

/** id から体質タイプを取得する */
export function getConstitutionById(id: string): ConstitutionType | undefined {
  return ALL_CONSTITUTIONS.find((c) => c.id === id)
}
