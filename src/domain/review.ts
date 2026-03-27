export type ReviewRecord = {
  problemId: string
  missCount: number           // 累計ミス回数
  consecutiveCorrect: number  // 連続正解回数
  lastAttemptedAt: string     // ISO 8601
}

// 新規 ReviewRecord を作成する
export function createInitialRecord(problemId: string): ReviewRecord {
  return { problemId, missCount: 0, consecutiveCorrect: 0, lastAttemptedAt: new Date().toISOString() }
}

// 再出題すべきか判定する
export function shouldReview(record: ReviewRecord): boolean {
  return record.missCount >= 1 && record.consecutiveCorrect < 2
}

// 回答後にレコードを更新する
export function updateRecord(record: ReviewRecord, correct: boolean): ReviewRecord {
  if (correct) {
    return {
      ...record,
      consecutiveCorrect: record.consecutiveCorrect + 1,
      lastAttemptedAt: new Date().toISOString(),
    }
  } else {
    return {
      ...record,
      missCount: record.missCount + 1,
      consecutiveCorrect: 0,
      lastAttemptedAt: new Date().toISOString(),
    }
  }
}
