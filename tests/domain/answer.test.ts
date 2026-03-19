import { isCorrect } from '../../src/domain/answer'
import type { Problem } from '../../src/domain/problem'

const problem: Problem = {
  id: 'p001',
  question: '漢字',
  correct: 'かんじ',
  choices: ['かんじ', 'かんし', 'かんぞ', 'かんぜ'],
  level: 1,
  tags: ['漢検3級'],
}

describe('isCorrect', () => {
  it('正解文字列を渡したとき true を返す', () => {
    expect(isCorrect(problem, 'かんじ')).toBe(true)
  })

  it('不正解文字列を渡したとき false を返す', () => {
    expect(isCorrect(problem, 'かんし')).toBe(false)
  })

  it('空文字を渡したとき false を返す', () => {
    expect(isCorrect(problem, '')).toBe(false)
  })
})
