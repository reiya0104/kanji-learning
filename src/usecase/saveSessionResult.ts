import type { Problem } from '../domain/problem'
import { createInitialRecord, updateRecord } from '../domain/review'
import { getRecord, saveRecords } from '../infrastructure/reviewRecordRepository'

export async function saveSessionResult(
  problems: Problem[],
  missedProblemIds: string[]
): Promise<void> {
  const missedSet = new Set(missedProblemIds)
  const updated = await Promise.all(
    problems.map(async (problem) => {
      const existing = await getRecord(problem.id)
      const base = existing ?? createInitialRecord(problem.id)
      return updateRecord(base, !missedSet.has(problem.id))
    })
  )
  await saveRecords(updated)
}
