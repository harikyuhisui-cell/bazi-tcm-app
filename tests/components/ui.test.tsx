import { render, screen, fireEvent } from '@testing-library/react'
import { BirthInputForm } from '@/components/BirthInputForm'
import { ConstitutionCard } from '@/components/ConstitutionCard'
import { Disclaimer } from '@/components/Disclaimer'
import { liverQiStagnation, qiBloodDeficiency } from '@/data/constitutions'

describe('Disclaimer', () => {
  test('免責文言を表示する', () => {
    render(<Disclaimer />)
    expect(screen.getByRole('note')).toHaveTextContent('医療診断ではありません')
  })
})

describe('BirthInputForm', () => {
  test('ドロップダウンの値で onSubmit が呼ばれる（時刻不明は正午）', () => {
    const onSubmit = jest.fn()
    render(<BirthInputForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('年'), { target: { value: '1990' } })
    fireEvent.change(screen.getByLabelText('月'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('日'), { target: { value: '15' } })
    fireEvent.click(screen.getByRole('button', { name: '体質傾向をみる' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: '',
      birthDate: '1990-05-15',
      birthTime: '12:00',
      timeUnknown: true,
      gender: 'female',
      symptomIds: [],
      familyIds: [],
    })
  })

  test('時・分・性別を指定して送信できる', () => {
    const onSubmit = jest.fn()
    render(<BirthInputForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('年'), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText('時'), { target: { value: '9' } })
    fireEvent.change(screen.getByLabelText('分'), { target: { value: '5' } })
    fireEvent.click(screen.getByLabelText('男性'))
    fireEvent.click(screen.getByRole('button', { name: '体質傾向をみる' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ birthTime: '09:05', timeUnknown: false, gender: 'male' })
    )
  })
})

describe('ConstitutionCard（性別による婦人科系の出し分け）', () => {
  test('女性には月経関連の受診サインを表示する（詳細を開く）', () => {
    render(
      <ConstitutionCard
        constitution={qiBloodDeficiency}
        reasons={['気血が不足しやすい配置です']}
        gender="female"
        rank={1}
        defaultOpen
      />
    )
    // 気血両虚の warningSignals に「月経量の異常」が含まれる
    expect(screen.getByText(/月経量の異常/)).toBeInTheDocument()
  })

  test('男性には月経関連の受診サインを表示しない（詳細を開く）', () => {
    render(
      <ConstitutionCard
        constitution={qiBloodDeficiency}
        reasons={['気血が不足しやすい配置です']}
        gender="male"
        rank={1}
        defaultOpen
      />
    )
    expect(screen.queryByText(/月経量の異常/)).not.toBeInTheDocument()
    // 婦人科系以外のサインは表示される
    expect(screen.getByText(/立ちくらみ/)).toBeInTheDocument()
  })

  test('詳細は初期状態で隠れ、ボタンで開閉できる', () => {
    render(
      <ConstitutionCard
        constitution={liverQiStagnation}
        reasons={['木（肝）の気が強い配置です']}
        gender="female"
        rank={2}
      />
    )
    // 概要（タイプ名・短い説明）は常に表示
    expect(screen.getByText('肝鬱気滞')).toBeInTheDocument()
    expect(screen.getByText('2番目に近い傾向')).toBeInTheDocument()
    // 初期は詳細（判定理由）が非表示
    expect(screen.queryByText('木（肝）の気が強い配置です')).not.toBeInTheDocument()
    // ボタンで開くと表示される
    fireEvent.click(screen.getByRole('button', { name: /詳しい内容を見る/ }))
    expect(screen.getByText('木（肝）の気が強い配置です')).toBeInTheDocument()
  })
})
