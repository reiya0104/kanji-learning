import { render, screen } from '@testing-library/react-native'
import ResultScreen from '../../src/screens/ResultScreen'

const mockNavigation = {} as any

describe('ResultScreen', () => {
  describe('表示', () => {
    it('正解数が表示される', () => {
      const mockRoute = {
        params: { correctCount: 7, missedProblemIds: ['p-001', 'p-003', 'p-005'] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('正解数: 7')).toBeDefined()
    })

    it('間違えた問題数が表示される', () => {
      const mockRoute = {
        params: { correctCount: 7, missedProblemIds: ['p-001', 'p-003', 'p-005'] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('間違えた問題数: 3')).toBeDefined()
    })

    it('正解数 0 のときも正しく表示される', () => {
      const mockRoute = {
        params: { correctCount: 0, missedProblemIds: [] },
      } as any
      render(<ResultScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('正解数: 0')).toBeDefined()
      expect(screen.getByText('間違えた問題数: 0')).toBeDefined()
    })
  })
})
