import { pickSession } from '../../src/usecase/sampleSession'
import type { Problem } from '../../src/domain/problem'

const makeProblems = (n: number): Problem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    question: `問${i + 1}`,
    correct: 'こたえ',
    choices: ['こたえ', 'ちがう1', 'ちがう2', 'ちがう3'],
    level: 1,
    tags: [],
  }))

describe('pickSession', () => {
  it('count 件を返す', () => {
    const problems = makeProblems(20)
    expect(pickSession(problems, 10)).toHaveLength(10)
  })

  it('問題数が count 未満のときは全問返す', () => {
    const problems = makeProblems(5)
    expect(pickSession(problems, 10)).toHaveLength(5)
  })

  it('返却された問題は元のリストに含まれる', () => {
    const problems = makeProblems(20)
    const session = pickSession(problems, 10)
    const ids = new Set(problems.map((p) => p.id))
    for (const p of session) {
      expect(ids.has(p.id)).toBe(true)
    }
  })

  it('重複がない', () => {
    const problems = makeProblems(20)
    const session = pickSession(problems, 10)
    const ids = session.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('毎回異なる順序を返す（10回中1回以上異なる）', () => {
    const problems = makeProblems(20)
    const results = Array.from({ length: 10 }, () =>
      pickSession(problems, 10).map((p) => p.id).join(',')
    )
    const unique = new Set(results)
    expect(unique.size).toBeGreaterThan(1)
  })
})
