import { shouldReview, updateRecord, createInitialRecord, isJustMastered } from '../../src/domain/review'
import type { ReviewRecord } from '../../src/domain/review'

const baseRecord: ReviewRecord = {
  problemId: 'p001',
  missCount: 0,
  consecutiveCorrect: 0,
  lastAttemptedAt: '2026-03-19T00:00:00.000Z',
}

describe('shouldReview', () => {
  it('missCount >= 1 かつ consecutiveCorrect < 2 のとき true を返す', () => {
    expect(shouldReview({ ...baseRecord, missCount: 1, consecutiveCorrect: 0 })).toBe(true)
    expect(shouldReview({ ...baseRecord, missCount: 2, consecutiveCorrect: 1 })).toBe(true)
  })

  it('consecutiveCorrect >= 2 のとき false を返す', () => {
    expect(shouldReview({ ...baseRecord, missCount: 1, consecutiveCorrect: 2 })).toBe(false)
    expect(shouldReview({ ...baseRecord, missCount: 3, consecutiveCorrect: 3 })).toBe(false)
  })

  it('missCount が 0 のとき false を返す', () => {
    expect(shouldReview({ ...baseRecord, missCount: 0, consecutiveCorrect: 0 })).toBe(false)
  })
})

describe('createInitialRecord', () => {
  it('missCount: 0, consecutiveCorrect: 0 の ReviewRecord を返す', () => {
    const record = createInitialRecord('p001')
    expect(record.problemId).toBe('p001')
    expect(record.missCount).toBe(0)
    expect(record.consecutiveCorrect).toBe(0)
  })

  it('lastAttemptedAt が ISO 8601 形式の文字列である', () => {
    const record = createInitialRecord('p001')
    expect(() => new Date(record.lastAttemptedAt).toISOString()).not.toThrow()
    expect(record.lastAttemptedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})

describe('updateRecord', () => {
  it('正解後に consecutiveCorrect がインクリメントされる', () => {
    const record = { ...baseRecord, missCount: 1, consecutiveCorrect: 0 }
    const updated = updateRecord(record, true)
    expect(updated.consecutiveCorrect).toBe(1)
    expect(updated.missCount).toBe(1)
  })

  it('ミス後に missCount がインクリメントされ consecutiveCorrect がリセットされる', () => {
    const record = { ...baseRecord, missCount: 1, consecutiveCorrect: 1 }
    const updated = updateRecord(record, false)
    expect(updated.missCount).toBe(2)
    expect(updated.consecutiveCorrect).toBe(0)
  })
})

describe('isJustMastered', () => {
  it('苦手あり・consecutiveCorrect が 1→2 になったとき true を返す', () => {
    const before = { ...baseRecord, missCount: 1, consecutiveCorrect: 1 }
    const after  = { ...baseRecord, missCount: 1, consecutiveCorrect: 2 }
    expect(isJustMastered(before, after)).toBe(true)
  })

  it('before がすでに consecutiveCorrect >= 2 のとき false を返す（解除済み）', () => {
    const before = { ...baseRecord, missCount: 1, consecutiveCorrect: 2 }
    const after  = { ...baseRecord, missCount: 1, consecutiveCorrect: 3 }
    expect(isJustMastered(before, after)).toBe(false)
  })

  it('after.consecutiveCorrect が 2 未満のとき false を返す', () => {
    const before = { ...baseRecord, missCount: 1, consecutiveCorrect: 0 }
    const after  = { ...baseRecord, missCount: 1, consecutiveCorrect: 1 }
    expect(isJustMastered(before, after)).toBe(false)
  })

  it('missCount が 0（苦手なし）のとき false を返す', () => {
    const before = { ...baseRecord, missCount: 0, consecutiveCorrect: 1 }
    const after  = { ...baseRecord, missCount: 0, consecutiveCorrect: 2 }
    expect(isJustMastered(before, after)).toBe(false)
  })

  it('1回正解 → 1回不正解ではフラグが解除されない', () => {
    const afterCorrect = updateRecord({ ...baseRecord, missCount: 1, consecutiveCorrect: 0 }, true)
    const afterMiss    = updateRecord(afterCorrect, false)
    expect(isJustMastered(afterCorrect, afterMiss)).toBe(false)
  })
})
