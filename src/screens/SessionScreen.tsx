import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { isCorrect } from '../domain/answer'
import type { Problem } from '../domain/problem'
import { getAllProblems } from '../infrastructure/problemRepository'
import type { SessionScreenProps } from '../navigation/types'
import { pickSession } from '../usecase/sampleSession'
import ProblemScreen from './ProblemScreen'

const SESSION_SIZE = 10

export default function SessionScreen({ navigation }: SessionScreenProps) {
  const [problems] = useState<Problem[]>(() => pickSession(getAllProblems(), SESSION_SIZE))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [missedProblemIds, setMissedProblemIds] = useState<string[]>([])

  const currentProblem = problems[currentIndex]

  function handleAnswer(choice: string) {
    const correct = isCorrect(currentProblem, choice)
    const newCorrectCount = correct ? correctCount + 1 : correctCount
    const newMissedIds = correct ? missedProblemIds : [...missedProblemIds, currentProblem.id]

    if (currentIndex + 1 >= problems.length) {
      navigation.navigate('Result', {
        correctCount: newCorrectCount,
        missedProblemIds: newMissedIds,
      })
    } else {
      setCurrentIndex(currentIndex + 1)
      setCorrectCount(newCorrectCount)
      setMissedProblemIds(newMissedIds)
    }
  }

  return (
    <View style={styles.container}>
      <Text testID="progress-text" style={styles.progress}>
        {currentIndex + 1} / {problems.length}
      </Text>
      <ProblemScreen problem={currentProblem} onAnswer={handleAnswer} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progress: { textAlign: 'center', padding: 16, fontSize: 16 },
})
