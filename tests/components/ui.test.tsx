import { render, screen, fireEvent } from '@testing-library/react'
import { BirthInputForm } from '@/components/BirthInputForm'
import { ConstitutionCard } from '@/components/ConstitutionCard'
import { Disclaimer } from '@/components/Disclaimer'
import { liverQiStagnation } from '@/data/constitutions'

describe('Disclaimer', () => {
  test('免責文言を表示する', () => {
    render(<Disclaimer />)
    expect(screen.getByRole('note')).toHaveTextContent('医療診断ではありません')
  })
})

describe('BirthInputForm', () => {
  test('入力した値で onSubmit が呼ばれる', () => {
    const onSubmit = jest.fn()
    render(<BirthInputForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('生年月日'), { target: { value: '1990-05-15' } })
    fireEvent.change(screen.getByLabelText(/出生時刻/), { target: { value: '10:30' } })
    fireEvent.click(screen.getByRole('button', { name: '体質傾向をみる' }))

    expect(onSubmit).toHaveBeenCalledWith({ birthDate: '1990-05-15', birthTime: '10:30' })
  })
})

describe('ConstitutionCard', () => {
  test('タイプ名・判定理由・受診サインを表示する', () => {
    render(
      <ConstitutionCard
        constitution={liverQiStagnation}
        reasons={['木（肝）の気が強い配置です']}
        isPrimary
      />
    )
    expect(screen.getByText('肝鬱気滞')).toBeInTheDocument()
    expect(screen.getByText('最も近い傾向')).toBeInTheDocument()
    expect(screen.getByText('木（肝）の気が強い配置です')).toBeInTheDocument()
    expect(screen.getByText('受診をおすすめするサイン')).toBeInTheDocument()
  })
})
