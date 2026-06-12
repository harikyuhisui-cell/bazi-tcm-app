'use client'

import { useState, type FormEvent } from 'react'

export type BirthInputValues = {
  birthDate: string
  birthTime: string
}

type Props = {
  onSubmit: (values: BirthInputValues) => void
}

/** 生年月日・出生時刻の入力フォーム */
export function BirthInputForm({ onSubmit }: Props) {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('12:00')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!birthDate) {
      setError('生年月日を入力してください')
      return
    }
    setError(null)
    onSubmit({ birthDate, birthTime })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="birthDate" className="text-sm font-medium">
          生年月日
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="birthTime" className="text-sm font-medium">
          出生時刻（不明な場合は正午のままで構いません）
        </label>
        <input
          id="birthTime"
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
      >
        体質傾向をみる
      </button>
    </form>
  )
}
