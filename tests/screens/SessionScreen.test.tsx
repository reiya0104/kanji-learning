import { render, screen, fireEvent } from '@testing-library/react-native'
import SessionScreen from '../../src/screens/SessionScreen'
import { getAllProblems } from '../../src/infrastructure/problemRepository'
import { pickSession } from '../../src/usecase/sampleSession'
import type { Problem } from '../../src/domain/problem'

jest.mock('../../src/infrastructure/problemRepository')
jest.mock('../../src/usecase/sampleSession')

const mockGetAllProblems = getAllProblems as jest.Mock
const mockPickSession = pickSession as jest.Mock

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate } as any
const mockRoute = {} as any

function makeProblems(count: number): Problem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${String(i + 1).padStart(3, '0')}`,
    question: `漢字${i + 1}`,
    correct: `よみ${i + 1}`,
    choices: [`よみ${i + 1}`, `ちがう${i + 1}a`, `ちがう${i + 1}b`, `ちがう${i + 1}c`],
    level: 1,
    tags: [],
  }))
}

const tenProblems = makeProblems(10)

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAllProblems.mockReturnValue(tenProblems)
  mockPickSession.mockReturnValue(tenProblems)
})

describe('SessionScreen', () => {
  describe('問題表示', () => {
    it('1問目の漢字が画面に表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('漢字1')).toBeDefined()
    })

    it('問題番号 "1 / 10" が表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByTestId('progress-text')).toBeDefined()
      expect(screen.getByText('1 / 10')).toBeDefined()
    })
  })

  describe('回答処理', () => {
    it('回答すると次の問題（2問目）に進む', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      expect(screen.getByText('漢字2')).toBeDefined()
      expect(screen.getByText('2 / 10')).toBeDefined()
    })

    it('10問目に回答すると Result 画面へ遷移する', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      for (let i = 1; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
      }
      expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
        correctCount: expect.any(Number),
        missedProblemIds: expect.any(Array),
      }))
    })

    it('正解数が正しく集計されて Result に渡される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目: 正解、2問目: 不正解、3〜10問目: 正解
      fireEvent.press(screen.getByText('よみ1'))       // 正解
      fireEvent.press(screen.getByText('ちがう2a'))    // 不正解
      for (let i = 3; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))  // 正解
      }
      expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
        correctCount: 9,
      }))
    })

    it('不正解の問題 ID が missedProblemIds に含まれる', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目: 正解、2問目: 不正解、3〜10問目: 正解
      fireEvent.press(screen.getByText('よみ1'))
      fireEvent.press(screen.getByText('ちがう2a'))
      for (let i = 3; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
      }
      expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
        missedProblemIds: ['p002'],
      }))
    })
  })
})
