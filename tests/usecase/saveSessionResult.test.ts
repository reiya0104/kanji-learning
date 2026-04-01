import { saveSessionResult } from '../../src/usecase/saveSessionResult'
import * as repo from '../../src/infrastructure/reviewRecordRepository'
import { createInitialRecord, updateRecord } from '../../src/domain/review'
import type { Problem } from '../../src/domain/problem'
import type { ReviewRecord } from '../../src/domain/review'

jest.mock('../../src/infrastructure/reviewRecordRepository')

const mockGetRecord = repo.getRecord as jest.Mock
const mockSaveRecords = repo.saveRecords as jest.Mock

function makeProblem(id: string): Problem {
  return { id, question: `漢字${id}`, correct: `よみ${id}`, choices: [`よみ${id}`, 'a', 'b', 'c'], level: 1, tags: [] }
}

const p1 = makeProblem('p001')
const p2 = makeProblem('p002')
const p3 = makeProblem('p003')
const problems = [p1, p2, p3]

beforeEach(() => {
  jest.clearAllMocks()
  mockGetRecord.mockResolvedValue(null)
})

describe('saveSessionResult', () => {
  it('ミスした問題は updateRecord(record, false) で更新して saveRecords に渡す', async () => {
    const existing: ReviewRecord = {
      problemId: 'p001',
      missCount: 1,
      consecutiveCorrect: 0,
      lastAttemptedAt: '2026-03-27T00:00:00.000Z',
    }
    mockGetRecord.mockImplementation((id: string) =>
      id === 'p001' ? Promise.resolve(existing) : Promise.resolve(null)
    )
    await saveSessionResult(problems, ['p001'])
    const [savedRecords] = mockSaveRecords.mock.calls[0] as [ReviewRecord[]]
    const saved = savedRecords.find((r) => r.problemId === 'p001')!
    const expected = updateRecord(existing, false)
    expect(saved.missCount).toBe(expected.missCount)
    expect(saved.consecutiveCorrect).toBe(expected.consecutiveCorrect)
  })

  it('正解した問題は updateRecord(record, true) で更新して saveRecords に渡す', async () => {
    const existing: ReviewRecord = {
      problemId: 'p002',
      missCount: 1,
      consecutiveCorrect: 0,
      lastAttemptedAt: '2026-03-27T00:00:00.000Z',
    }
    mockGetRecord.mockImplementation((id: string) =>
      id === 'p002' ? Promise.resolve(existing) : Promise.resolve(null)
    )
    await saveSessionResult(problems, [])
    const [savedRecords] = mockSaveRecords.mock.calls[0] as [ReviewRecord[]]
    const saved = savedRecords.find((r) => r.problemId === 'p002')!
    const expected = updateRecord(existing, true)
    expect(saved.consecutiveCorrect).toBe(expected.consecutiveCorrect)
    expect(saved.missCount).toBe(expected.missCount)
  })

  it('既存レコードがない問題は createInitialRecord で初期化してから updateRecord を呼ぶ', async () => {
    mockGetRecord.mockResolvedValue(null)
    await saveSessionResult(problems, ['p001'])
    const [savedRecords] = mockSaveRecords.mock.calls[0] as [ReviewRecord[]]
    const saved = savedRecords.find((r) => r.problemId === 'p001')!
    const initial = createInitialRecord('p001')
    const expected = updateRecord(initial, false)
    expect(saved.missCount).toBe(expected.missCount)
    expect(saved.consecutiveCorrect).toBe(expected.consecutiveCorrect)
  })

  it('全 problems が saveRecords に渡される', async () => {
    await saveSessionResult(problems, ['p001'])
    const [savedRecords] = mockSaveRecords.mock.calls[0] as [ReviewRecord[]]
    const ids = savedRecords.map((r) => r.problemId)
    expect(ids).toContain('p001')
    expect(ids).toContain('p002')
    expect(ids).toContain('p003')
    expect(savedRecords).toHaveLength(3)
  })

  describe('masteredProblemIds の返却', () => {
    it('consecutiveCorrect 1→2 になった苦手問題の ID を返す', async () => {
      const existing: ReviewRecord = {
        problemId: 'p001', missCount: 1, consecutiveCorrect: 1,
        lastAttemptedAt: '2026-03-27T00:00:00.000Z',
      }
      mockGetRecord.mockImplementation((id: string) =>
        id === 'p001' ? Promise.resolve(existing) : Promise.resolve(null)
      )
      const result = await saveSessionResult(problems, []) // p001 正解
      expect(result).toContain('p001')
    })

    it('consecutiveCorrect が 2 に届かない問題は含まれない', async () => {
      const existing: ReviewRecord = {
        problemId: 'p001', missCount: 1, consecutiveCorrect: 0,
        lastAttemptedAt: '2026-03-27T00:00:00.000Z',
      }
      mockGetRecord.mockImplementation((id: string) =>
        id === 'p001' ? Promise.resolve(existing) : Promise.resolve(null)
      )
      const result = await saveSessionResult(problems, [])
      expect(result).not.toContain('p001')
    })

    it('苦手フラグがない問題（missCount=0）は含まれない', async () => {
      const existing: ReviewRecord = {
        problemId: 'p001', missCount: 0, consecutiveCorrect: 1,
        lastAttemptedAt: '2026-03-27T00:00:00.000Z',
      }
      mockGetRecord.mockImplementation((id: string) =>
        id === 'p001' ? Promise.resolve(existing) : Promise.resolve(null)
      )
      const result = await saveSessionResult(problems, [])
      expect(result).not.toContain('p001')
    })

    it('解除がない場合は空配列を返す', async () => {
      mockGetRecord.mockResolvedValue(null)
      const result = await saveSessionResult(problems, ['p001', 'p002', 'p003'])
      expect(result).toEqual([])
    })
  })
})
