import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import SessionScreen from '../../src/screens/SessionScreen'
import { getAllProblems } from '../../src/infrastructure/problemRepository'
import { pickSession } from '../../src/usecase/sampleSession'
import { saveSessionResult } from '../../src/usecase/saveSessionResult'
import type { Problem } from '../../src/domain/problem'

jest.mock('../../src/infrastructure/problemRepository')
jest.mock('../../src/usecase/sampleSession')
jest.mock('../../src/usecase/saveSessionResult')

const mockGetAllProblems = getAllProblems as jest.Mock
const mockPickSession = pickSession as jest.Mock
const mockSaveSessionResult = saveSessionResult as jest.Mock

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
  mockSaveSessionResult.mockResolvedValue(undefined)
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
    it('回答して「次へ」を押すと次の問題（2問目）に進む', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      fireEvent.press(screen.getByText('次へ'))
      expect(screen.getByText('漢字2')).toBeDefined()
      expect(screen.getByText('2 / 10')).toBeDefined()
    })

    it('10問目に回答して「次へ」を押すと Result 画面へ遷移する', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      for (let i = 1; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
          correctCount: expect.any(Number),
          missedProblemIds: expect.any(Array),
        }))
      })
    })

    it('正解数が正しく集計されて Result に渡される', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目: 正解、2問目: 不正解、3〜10問目: 正解
      fireEvent.press(screen.getByText('よみ1'))       // 正解
      fireEvent.press(screen.getByText('次へ'))
      fireEvent.press(screen.getByText('ちがう2a'))    // 不正解 → p002 が末尾に追加される
      fireEvent.press(screen.getByText('次へ'))
      for (let i = 3; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))  // 正解
        fireEvent.press(screen.getByText('次へ'))
      }
      // 11問目（p002 の再出題）を不正解（既に reviewProblemIds にあるため再追加なし）
      fireEvent.press(screen.getByText('ちがう2a'))
      fireEvent.press(screen.getByText('次へ'))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
          correctCount: 9,
        }))
      })
    })

    it('不正解の問題 ID が missedProblemIds に含まれる', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目: 正解、2問目: 不正解、3〜10問目: 正解
      fireEvent.press(screen.getByText('よみ1'))
      fireEvent.press(screen.getByText('次へ'))
      fireEvent.press(screen.getByText('ちがう2a'))    // 不正解 → p002 が末尾に追加される
      fireEvent.press(screen.getByText('次へ'))
      for (let i = 3; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      // 11問目（p002 の再出題）を正解
      fireEvent.press(screen.getByText('よみ2'))
      fireEvent.press(screen.getByText('次へ'))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
          missedProblemIds: ['p002'],
        }))
      })
    })
  })

  describe('ReviewRecord 保存', () => {
    it('最終問題の「次へ」を押したとき saveSessionResult が呼ばれる', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      for (let i = 1; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      await waitFor(() => {
        expect(mockSaveSessionResult).toHaveBeenCalledTimes(1)
      })
    })

    it('saveSessionResult には初期10問と missedProblemIds が渡される', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))      // 正解
      fireEvent.press(screen.getByText('次へ'))
      fireEvent.press(screen.getByText('ちがう2a'))  // 不正解 → p002 が末尾に追加される
      fireEvent.press(screen.getByText('次へ'))
      for (let i = 3; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      // 11問目（p002 の再出題）を正解して Result へ
      fireEvent.press(screen.getByText('よみ2'))
      fireEvent.press(screen.getByText('次へ'))
      await waitFor(() => {
        // 再出題分を除いた初期10問と missedProblemIds が渡される
        expect(mockSaveSessionResult).toHaveBeenCalledWith(tenProblems, ['p002'])
      })
    })

    it('中間問題の「次へ」では saveSessionResult が呼ばれない', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      fireEvent.press(screen.getByText('次へ'))
      expect(mockSaveSessionResult).not.toHaveBeenCalled()
    })
  })

  describe('初回ミス再出題', () => {
    it('不正解にした問題はセッション末尾に追加されて再出題される', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目を不正解
      fireEvent.press(screen.getByText('ちがう1a'))
      fireEvent.press(screen.getByText('次へ'))
      // 2〜10問目を正解で進める
      for (let i = 2; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      // 11問目（再出題）は1問目と同じ漢字
      expect(screen.getByText('漢字1')).toBeDefined()
    })

    it('再出題問題には「復習」バッジが表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目を不正解
      fireEvent.press(screen.getByText('ちがう1a'))
      fireEvent.press(screen.getByText('次へ'))
      // 2〜10問目を正解で進める
      for (let i = 2; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      // 再出題画面に「復習」バッジが出る
      expect(screen.getByTestId('review-badge')).toBeDefined()
    })

    it('同じ問題を2回ミスしても再出題への追加は1回だけ', async () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目を不正解
      fireEvent.press(screen.getByText('ちがう1a'))
      fireEvent.press(screen.getByText('次へ'))
      // 2〜10問目を正解で進める
      for (let i = 2; i <= 10; i++) {
        fireEvent.press(screen.getByText(`よみ${i}`))
        fireEvent.press(screen.getByText('次へ'))
      }
      // 再出題（11問目）も不正解
      fireEvent.press(screen.getByText('ちがう1a'))
      fireEvent.press(screen.getByText('次へ'))
      // 12問目は存在しない → Result 画面へ遷移する
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Result', expect.objectContaining({
          correctCount: expect.any(Number),
        }))
      })
    })

    it('再出題が追加されると進捗の分母が増える', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      // 1問目を不正解
      fireEvent.press(screen.getByText('ちがう1a'))
      fireEvent.press(screen.getByText('次へ'))
      // 2問目表示時点で分母は 11 になっている
      expect(screen.getByText('2 / 11')).toBeDefined()
    })
  })

  describe('フィードバック表示（2フェーズフロー）', () => {
    it('正解を選ぶと「正解！」が表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      expect(screen.getByText('正解！')).toBeDefined()
    })

    it('不正解を選ぶと「不正解」が表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('ちがう1a'))
      expect(screen.getByText('不正解')).toBeDefined()
    })

    it('不正解を選ぶと正解の読み仮名が表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('ちがう1a'))
      expect(screen.getByText('正解：よみ1')).toBeDefined()
    })

    it('回答後は「次へ」ボタンが表示される', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      expect(screen.getByText('次へ')).toBeDefined()
    })

    it('回答前は「次へ」ボタンが表示されない', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      expect(screen.queryByText('次へ')).toBeNull()
    })

    it('「次へ」を押すまで次の問題に進まない', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      expect(screen.queryByText('漢字2')).toBeNull()
      expect(screen.getByText('漢字1')).toBeDefined()
    })

    it('次の問題ではフィードバック表示がリセットされる', () => {
      render(<SessionScreen navigation={mockNavigation} route={mockRoute} />)
      fireEvent.press(screen.getByText('よみ1'))
      expect(screen.getByText('正解！')).toBeDefined()
      fireEvent.press(screen.getByText('次へ'))
      expect(screen.queryByText('正解！')).toBeNull()
    })
  })
})
