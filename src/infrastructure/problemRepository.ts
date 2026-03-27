import type { Problem } from '../domain/problem'
import data from '../../data/problems/sample.json'

export function getAllProblems(): Problem[] {
  return data
}
