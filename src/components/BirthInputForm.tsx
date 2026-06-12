'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { SymptomChecklist } from './SymptomChecklist'
import { pruneSymptomIdsByGender } from '@/lib/tcm/symptoms'
import type { Gender } from '@/lib/tcm/gender'

export type BirthInputValues = {
  name: string
  birthDate: string
  birthTime: string
  /** 出生時刻が不明か（不明時は正午で計算） */
  timeUnknown: boolean
  gender: Gender
  symptomIds: string[]
}

type Props = {
  onSubmit: (values: BirthInputValues) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1920 + 1 }, (_, i) => CURRENT_YEAR - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

const pad = (n: number) => String(n).padStart(2, '0')

/** 月の日数（うるう年考慮） */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** ラベル付きセレクト */
function Select({
  label,
  value,
  onChange,
  children,
  width = 'w-24',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: ReactNode
  width?: string
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} rounded-md border border-gray-300 bg-white px-2 py-2 text-center`}
      >
        {children}
      </select>
      <span className="text-sm text-gray-600">{label}</span>
    </span>
  )
}

/** 生年月日・出生時刻・性別の入力フォーム */
export function BirthInputForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [year, setYear] = useState(1970)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [hour, setHour] = useState<number | null>(null) // null = 不明
  const [minute, setMinute] = useState<number | null>(null)
  const [gender, setGender] = useState<Gender>('female')
  const [symptomIds, setSymptomIds] = useState<string[]>([])

  const maxDay = daysInMonth(year, month)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)
  // 月の変更で日が範囲外になった場合は丸める
  const safeDay = Math.min(day, maxDay)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const timeUnknown = hour === null
    onSubmit({
      name: name.trim(),
      birthDate: `${year}-${pad(month)}-${pad(safeDay)}`,
      // 時刻不明なら正午で算出。分のみ不明なら00分。
      birthTime: timeUnknown ? '12:00' : `${pad(hour)}:${pad(minute ?? 0)}`,
      timeUnknown,
      gender,
      symptomIds: pruneSymptomIdsByGender(symptomIds, gender),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* おなまえ */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <label htmlFor="name" className="w-24 shrink-0 font-medium">
          おなまえ
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="任意"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* 生年月日 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <span className="w-24 shrink-0 font-medium">生年月日</span>
        <div className="flex flex-wrap items-center gap-2">
          <Select label="年" value={String(year)} onChange={(v) => setYear(Number(v))}>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
          <Select label="月" value={String(month)} onChange={(v) => setMonth(Number(v))} width="w-16">
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
          <Select label="日" value={String(safeDay)} onChange={(v) => setDay(Number(v))} width="w-16">
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* 出生時間 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <span className="w-24 shrink-0 font-medium">出生時間</span>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            label="時"
            value={hour === null ? '' : String(hour)}
            onChange={(v) => setHour(v === '' ? null : Number(v))}
          >
            <option value="">不明</option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>
          <Select
            label="分"
            value={minute === null ? '' : String(minute)}
            onChange={(v) => setMinute(v === '' ? null : Number(v))}
          >
            <option value="">不明</option>
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        ※出生時間が不明な場合は「不明」のままで構いません（正午として算出します）。
      </p>

      {/* 性別 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <span className="w-24 shrink-0 font-medium">性別</span>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="h-4 w-4"
            />
            女性
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="h-4 w-4"
            />
            男性
          </label>
        </div>
      </div>

      <SymptomChecklist checkedIds={symptomIds} onChange={setSymptomIds} gender={gender} />

      <button
        type="submit"
        className="rounded-md bg-emerald-700 px-4 py-3 text-lg font-medium text-white hover:bg-emerald-800"
      >
        体質傾向をみる
      </button>
    </form>
  )
}
