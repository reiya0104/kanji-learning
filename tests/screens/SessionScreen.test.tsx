import { render, screen, fireEvent } from '@testing-library/react-native'
import SessionScreen from '../../src/screens/SessionScreen'

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate } as any
const mockRoute = {} as any

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SessionScreen', () => {
  describe('表示', () => {
    it('セッション画面のプレースホルダーテキストが表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('セッション画面（実装予定）')).toBeDefined()
    })

    it('結果画面へ進むボタンが表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByTestId('go-to-result-button')).toBeDefined()
    })
  })

  describe('ナビゲーション', () => {
    it('結果ボタンをタップすると correctCount と missedProblemIds を渡して Result 画面へ遷移する', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByTestId('go-to-result-button'))
      expect(mockNavigate).toHaveBeenCalledWith('Result', {
        correctCount: 0,
        missedProblemIds: [],
      })
    })
  })
})
