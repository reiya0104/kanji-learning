export type Problem = {
  id: string
  question: string    // 例：「漢字」
  correct: string     // 例：「かんじ」
  choices: string[]   // 4択（correct を含む）
  level: number       // 1〜5
  tags: string[]      // 例：["漢検2級", "四字熟語"]
}
