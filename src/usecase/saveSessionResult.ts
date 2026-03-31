import type { Problem } from '../domain/problem'
import { createInitialRecord, updateRecord, isJustMastered } from '../domain/review'
import { getRecord, saveRecords } from '../infrastructure/reviewRecordRepository'

export async function saveSessionResult(
  problems: Problem[],
  missedProblemIds: string[]
): Promise<string[]> {
  const missedSet = new Set(missedProblemIds)
  const pairs = await Promise.all(
    problems.map(async (problem) => {
      const existing = await getRecord(problem.id)
      const base = existing ?? createInitialRecord(problem.id)
      const updated = updateRecord(base, !missedSet.has(problem.id))
      return { base, updated }
    })
  )
  await saveRecords(pairs.map(({ updated }) => updated))
  return pairs
    .filter(({ base, updated }) => isJustMastered(base, updated))
    .map(({ updated }) => updated.problemId)
}
