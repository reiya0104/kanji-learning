import { render, screen } from '@testing-library/react-native'
import * as ExpoFont from 'expo-font'
import App from '../App'

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@expo-google-fonts/noto-sans-jp', () => ({
  NotoSansJP_400Regular: 0,
  NotoSansJP_700Bold: 0,
}))

describe('App', () => {
  it('ホーム画面のタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('漢字学習アプリ')).toBeDefined()
  })

  it('セッション開始ボタンが表示される', () => {
    render(<App />)
    expect(screen.getByTestId('start-session-button')).toBeDefined()
  })

  it('フォント読み込み中は何も表示されない', () => {
    jest.mocked(ExpoFont.useFonts).mockReturnValueOnce([false, null])
    const { toJSON } = render(<App />)
    expect(toJSON()).toBeNull()
  })
})
