import { render, screen, fireEvent } from '@testing-library/react-native'
import ProblemScreen from '../../src/screens/ProblemScreen'
import type { Problem } from '../../src/domain/problem'

const mockProblem: Problem = {
  id: 'p-001',
  question: '漢字',
  correct: 'かんじ',
  choices: ['かんじ', 'かんご', 'えいご', 'にほんご'],
  level: 2,
  tags: ['漢検2級'],
}

describe('ProblemScreen', () => {
  describe('問題表示', () => {
    it('問題の漢字（question）が表示される', () => {
      render(<ProblemScreen problem={mockProblem} onAnswer={() => {}} />)
      expect(screen.getByText('漢字')).toBeDefined()
    })
  })

  describe('選択肢ボタン', () => {
    it('4つの選択肢ボタンが表示される', () => {
      render(<ProblemScreen problem={mockProblem} onAnswer={() => {}} />)
      expect(screen.getByText('かんじ')).toBeDefined()
      expect(screen.getByText('かんご')).toBeDefined()
      expect(screen.getByText('えいご')).toBeDefined()
      expect(screen.getByText('にほんご')).toBeDefined()
    })

    it('選択肢をタップすると onAnswer が選んだ選択肢を引数に呼ばれる', () => {
      const onAnswer = jest.fn()
      render(<ProblemScreen problem={mockProblem} onAnswer={onAnswer} />)
      fireEvent.press(screen.getByText('えいご'))
      expect(onAnswer).toHaveBeenCalledWith('えいご')
    })

    it('別の選択肢をタップしても onAnswer がその選択肢を引数に呼ばれる', () => {
      const onAnswer = jest.fn()
      render(<ProblemScreen problem={mockProblem} onAnswer={onAnswer} />)
      fireEvent.press(screen.getByText('かんじ'))
      expect(onAnswer).toHaveBeenCalledWith('かんじ')
    })
  })
})
