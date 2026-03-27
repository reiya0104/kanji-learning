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
      render(<ProblemScreen problem={mockProblem} onAnswer={() => {}} feedback={null} onNext={() => {}} />)
      expect(screen.getByText('漢字')).toBeDefined()
    })
  })

  describe('選択肢ボタン', () => {
    it('4つの選択肢ボタンが表示される', () => {
      render(<ProblemScreen problem={mockProblem} onAnswer={() => {}} feedback={null} onNext={() => {}} />)
      expect(screen.getByText('かんじ')).toBeDefined()
      expect(screen.getByText('かんご')).toBeDefined()
      expect(screen.getByText('えいご')).toBeDefined()
      expect(screen.getByText('にほんご')).toBeDefined()
    })

    it('選択肢をタップすると onAnswer が選んだ選択肢を引数に呼ばれる', () => {
      const onAnswer = jest.fn()
      render(<ProblemScreen problem={mockProblem} onAnswer={onAnswer} feedback={null} onNext={() => {}} />)
      fireEvent.press(screen.getByText('えいご'))
      expect(onAnswer).toHaveBeenCalledWith('えいご')
    })

    it('別の選択肢をタップしても onAnswer がその選択肢を引数に呼ばれる', () => {
      const onAnswer = jest.fn()
      render(<ProblemScreen problem={mockProblem} onAnswer={onAnswer} feedback={null} onNext={() => {}} />)
      fireEvent.press(screen.getByText('かんじ'))
      expect(onAnswer).toHaveBeenCalledWith('かんじ')
    })
  })

  describe('フィードバック表示', () => {
    it('feedback が null のとき「次へ」ボタンは表示されない', () => {
      render(<ProblemScreen problem={mockProblem} onAnswer={() => {}} feedback={null} onNext={() => {}} />)
      expect(screen.queryByText('次へ')).toBeNull()
    })

    it('feedback.isCorrect が true のとき「正解！」テキストが表示される', () => {
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: true, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      expect(screen.getByText('正解！')).toBeDefined()
    })

    it('feedback.isCorrect が false のとき「不正解」テキストが表示される', () => {
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: false, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      expect(screen.getByText('不正解')).toBeDefined()
    })

    it('feedback.isCorrect が false のとき feedback.correctAnswer が表示される', () => {
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: false, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      expect(screen.getByText('正解：かんじ')).toBeDefined()
    })

    it('feedback.isCorrect が true のとき正解の読み仮名は表示されない', () => {
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: true, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      expect(screen.queryByText('正解：かんじ')).toBeNull()
    })

    it('feedback が非null のとき「次へ」ボタンが表示される', () => {
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: true, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      expect(screen.getByText('次へ')).toBeDefined()
    })

    it('「次へ」ボタンをタップすると onNext が呼ばれる', () => {
      const onNext = jest.fn()
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={() => {}}
          feedback={{ isCorrect: true, correctAnswer: 'かんじ' }}
          onNext={onNext}
        />
      )
      fireEvent.press(screen.getByText('次へ'))
      expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('feedback が非null のとき選択肢をタップしても onAnswer は呼ばれない', () => {
      const onAnswer = jest.fn()
      render(
        <ProblemScreen
          problem={mockProblem}
          onAnswer={onAnswer}
          feedback={{ isCorrect: true, correctAnswer: 'かんじ' }}
          onNext={() => {}}
        />
      )
      fireEvent.press(screen.getByText('えいご'))
      expect(onAnswer).not.toHaveBeenCalled()
    })
  })
})
