import type { Problem } from './problem'

export function isCorrect(problem: Problem, answer: string): boolean {
  return answer !== '' && answer === problem.correct
}
