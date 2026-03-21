import { render, screen } from '@testing-library/react-native'
import App from '../App'

describe('App', () => {
  it('アプリ名テキストが表示される', () => {
    render(<App />)
    expect(screen.getByText('漢字学習アプリ')).toBeTruthy()
  })
})
