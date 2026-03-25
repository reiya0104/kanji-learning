import { render, screen } from '@testing-library/react-native'
import App from '../App'

describe('App', () => {
  it('ホーム画面のタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('漢字学習アプリ')).toBeDefined()
  })

  it('セッション開始ボタンが表示される', () => {
    render(<App />)
    expect(screen.getByTestId('start-session-button')).toBeDefined()
  })
})
