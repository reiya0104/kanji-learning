import { render, screen, fireEvent } from '@testing-library/react-native'
import ResultScreen from '../../src/screens/ResultScreen'

describe('ResultScreen', () => {
  describe('表示', () => {
    it('{correctCount} / 10 の形式で正解数が表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 7, missedProblemIds: ['p001', 'p003'], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('7 / 10')).toBeDefined()
    })

    it('間違えた問題が一覧で表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      // p001: "漢字", p002: "読書"（data/problems/sample.json の実 ID を使用）
      const mockRoute = {
        params: { correctCount: 8, missedProblemIds: ['p001', 'p002'], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('漢字')).toBeDefined()
      expect(screen.getByText('読書')).toBeDefined()
    })

    it('正解数 0 のときも正しく表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 0, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('0 / 10')).toBeDefined()
    })

    it('「もう一度」ボタンが表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 5, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('もう一度')).toBeDefined()
    })

    it('「終了」ボタンが表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 5, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('終了')).toBeDefined()
    })
  })

  describe('操作', () => {
    it('「もう一度」をタップすると Session に遷移する', () => {
      const mockNavigate = jest.fn()
      const mockNavigation = { navigate: mockNavigate } as any
      const mockRoute = {
        params: { correctCount: 5, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('もう一度'))
      expect(mockNavigate).toHaveBeenCalledWith('Session')
    })

    it('「終了」をタップすると Home に遷移する', () => {
      const mockNavigate = jest.fn()
      const mockNavigation = { navigate: mockNavigate } as any
      const mockRoute = {
        params: { correctCount: 5, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('終了'))
      expect(mockNavigate).toHaveBeenCalledWith('Home')
    })
  })

  describe('習得フィードバック', () => {
    it('masteredProblemIds が空のときは習得セクションが表示されない', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 5, missedProblemIds: [], masteredProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.queryByTestId('mastered-section')).toBeNull()
    })

    it('masteredProblemIds に ID があるとき習得セクションが表示される', () => {
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 8, missedProblemIds: [], masteredProblemIds: ['p001'] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByTestId('mastered-section')).toBeDefined()
    })

    it('習得した問題の漢字が習得セクションに表示される', () => {
      // p001.question = '漢字'（data/problems/sample.json 準拠）
      const mockNavigation = { navigate: jest.fn() } as any
      const mockRoute = {
        params: { correctCount: 8, missedProblemIds: [], masteredProblemIds: ['p001'] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByTestId('mastered-section')).toBeDefined()
      expect(screen.getByText('漢字')).toBeDefined()
    })
  })
})
