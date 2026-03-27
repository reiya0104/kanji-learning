import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { isCorrect } from '../domain/answer'
import type { Problem } from '../domain/problem'
import { getAllProblems } from '../infrastructure/problemRepository'
import type { SessionScreenProps } from '../navigation/types'
import { pickSession } from '../usecase/sampleSession'
import ProblemScreen, { type Feedback } from './ProblemScreen'

const SESSION_SIZE = 10

export default function SessionScreen({ navigation }: SessionScreenProps) {
  const [problems] = useState<Problem[]>(() => pickSession(getAllProblems(), SESSION_SIZE))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [missedProblemIds, setMissedProblemIds] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)

  const currentProblem = problems[currentIndex]

  function handleAnswer(choice: string) {
    const correct = isCorrect(currentProblem, choice)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      setMissedProblemIds((ids) => [...ids, currentProblem.id])
    }
    setFeedback({ isCorrect: correct, correctAnswer: currentProblem.correct })
  }

  function handleNext() {
    if (currentIndex + 1 >= problems.length) {
      navigation.navigate('Result', {
        correctCount,
        missedProblemIds,
      })
    } else {
      setCurrentIndex(currentIndex + 1)
      setFeedback(null)
    }
  }

  return (
    <View style={styles.container}>
      <Text testID="progress-text" style={styles.progress}>
        {currentIndex + 1} / {problems.length}
      </Text>
      <ProblemScreen
        problem={currentProblem}
        onAnswer={handleAnswer}
        feedback={feedback}
        onNext={handleNext}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progress: { textAlign: 'center', padding: 16, fontSize: 16 },
})
