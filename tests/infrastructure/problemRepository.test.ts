import { getAllProblems } from '../../src/infrastructure/problemRepository'

describe('getAllProblems', () => {
  it('Problem[] を返す', () => {
    const problems = getAllProblems()
    expect(Array.isArray(problems)).toBe(true)
    expect(problems.length).toBeGreaterThan(0)
  })

  it('各要素が Problem 型の必須フィールドを持つ', () => {
    const problems = getAllProblems()
    for (const p of problems) {
      expect(typeof p.id).toBe('string')
      expect(typeof p.question).toBe('string')
      expect(typeof p.correct).toBe('string')
      expect(Array.isArray(p.choices)).toBe(true)
      expect(typeof p.level).toBe('number')
      expect(Array.isArray(p.tags)).toBe(true)
    }
  })

  it('choices に correct が含まれる', () => {
    const problems = getAllProblems()
    for (const p of problems) {
      expect(p.choices).toContain(p.correct)
    }
  })
})
