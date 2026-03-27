import * as FileSystem from 'expo-file-system'
import type { ReviewRecord } from '../domain/review'

const RECORDS_FILE = FileSystem.documentDirectory + 'review_records.json'

async function readAll(): Promise<Record<string, ReviewRecord>> {
  const info = await FileSystem.getInfoAsync(RECORDS_FILE)
  if (!info.exists) return {}
  const json = await FileSystem.readAsStringAsync(RECORDS_FILE)
  return JSON.parse(json) as Record<string, ReviewRecord>
}

export async function getAllRecords(): Promise<Record<string, ReviewRecord>> {
  return readAll()
}

export async function getRecord(problemId: string): Promise<ReviewRecord | null> {
  const all = await readAll()
  return all[problemId] ?? null
}

export async function saveRecord(record: ReviewRecord): Promise<void> {
  const all = await readAll()
  all[record.problemId] = record
  await FileSystem.writeAsStringAsync(RECORDS_FILE, JSON.stringify(all))
}

export async function saveRecords(records: ReviewRecord[]): Promise<void> {
  const all = await readAll()
  for (const record of records) {
    all[record.problemId] = record
  }
  await FileSystem.writeAsStringAsync(RECORDS_FILE, JSON.stringify(all))
}
