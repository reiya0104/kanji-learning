import * as FileSystem from 'expo-file-system'
import {
  getAllRecords,
  getRecord,
  saveRecord,
  saveRecords,
} from '../../src/infrastructure/reviewRecordRepository'
import type { ReviewRecord } from '../../src/domain/review'

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///test/',
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}))

const mockGetInfoAsync = FileSystem.getInfoAsync as jest.Mock
const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.Mock
const mockWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.Mock

const RECORDS_FILE = 'file:///test/review_records.json'

const record1: ReviewRecord = {
  problemId: 'p001',
  missCount: 1,
  consecutiveCorrect: 0,
  lastAttemptedAt: '2026-03-27T00:00:00.000Z',
}

const record2: ReviewRecord = {
  problemId: 'p002',
  missCount: 2,
  consecutiveCorrect: 1,
  lastAttemptedAt: '2026-03-27T01:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getAllRecords', () => {
  it('ファイルが存在しない場合は空のオブジェクトを返す', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: false })
    const result = await getAllRecords()
    expect(result).toEqual({})
  })

  it('ファイルが存在する場合は JSON をパースして返す', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p001: record1 }))
    const result = await getAllRecords()
    expect(result).toEqual({ p001: record1 })
  })
})

describe('getRecord', () => {
  it('指定 problemId のレコードが存在する場合はそのレコードを返す', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p001: record1, p002: record2 }))
    const result = await getRecord('p001')
    expect(result).toEqual(record1)
  })

  it('指定 problemId のレコードが存在しない場合は null を返す', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p002: record2 }))
    const result = await getRecord('p001')
    expect(result).toBeNull()
  })
})

describe('saveRecord', () => {
  it('新規レコードがファイルに書き込まれる', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: false })
    await saveRecord(record1)
    expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
      RECORDS_FILE,
      JSON.stringify({ p001: record1 })
    )
  })

  it('既存レコードが上書きされる', async () => {
    const existingRecord = { ...record1, missCount: 1 }
    const updatedRecord = { ...record1, missCount: 2 }
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p001: existingRecord }))
    await saveRecord(updatedRecord)
    expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
      RECORDS_FILE,
      JSON.stringify({ p001: updatedRecord })
    )
  })

  it('他の problemId のレコードは保持される', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p002: record2 }))
    await saveRecord(record1)
    expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
      RECORDS_FILE,
      JSON.stringify({ p002: record2, p001: record1 })
    )
  })
})

describe('saveRecords', () => {
  it('複数レコードをまとめて保存できる', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: false })
    await saveRecords([record1, record2])
    expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
      RECORDS_FILE,
      JSON.stringify({ p001: record1, p002: record2 })
    )
  })

  it('既存レコードとマージされる', async () => {
    const record3: ReviewRecord = {
      problemId: 'p003',
      missCount: 1,
      consecutiveCorrect: 0,
      lastAttemptedAt: '2026-03-27T02:00:00.000Z',
    }
    mockGetInfoAsync.mockResolvedValue({ exists: true })
    mockReadAsStringAsync.mockResolvedValue(JSON.stringify({ p003: record3 }))
    await saveRecords([record1, record2])
    expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
      RECORDS_FILE,
      JSON.stringify({ p003: record3, p001: record1, p002: record2 })
    )
  })
})
