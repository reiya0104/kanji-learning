import type { Problem } from '../domain/problem'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/problems/sample.json') as Problem[]

export function getAllProblems(): Problem[] {
  return data
}
