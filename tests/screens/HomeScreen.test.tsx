import { render, screen, fireEvent } from '@testing-library/react-native'
import HomeScreen from '../../src/screens/HomeScreen'

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate } as any
const mockRoute = {} as any

beforeEach(() => {
  jest.clearAllMocks()
})

describe('HomeScreen', () => {
  describe('表示', () => {
    it('アプリタイトルが表示される', () => {
      render(<HomeScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByText('漢字学習アプリ')).toBeDefined()
    })

    it('セッション開始ボタンが表示される', () => {
      render(<HomeScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.getByTestId('start-session-button')).toBeDefined()
    })
  })

  describe('ナビゲーション', () => {
    it('セッション開始ボタンをタップすると Session 画面へ遷移する', () => {
      render(<HomeScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByTestId('start-session-button'))
      expect(mockNavigate).toHaveBeenCalledWith('Session')
    })
  })
})
