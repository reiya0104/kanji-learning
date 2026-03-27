import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { Problem } from '../domain/problem'

export type Feedback = {
  isCorrect: boolean
  correctAnswer: string
} | null

type Props = {
  problem: Problem
  onAnswer: (choice: string) => void
  feedback: Feedback
  onNext: () => void
}

export default function ProblemScreen({ problem, onAnswer, feedback, onNext }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{problem.question}</Text>
      <View style={styles.choices}>
        {problem.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.choiceButton}
            onPress={() => onAnswer(choice)}
            disabled={feedback !== null}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {feedback !== null && (
        <View
          style={[
            styles.feedbackContainer,
            feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              feedback.isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect,
            ]}
          >
            {feedback.isCorrect ? '正解！' : '不正解'}
          </Text>
          {!feedback.isCorrect && (
            <Text style={styles.correctAnswerText}>正解：{feedback.correctAnswer}</Text>
          )}
        </View>
      )}
      {feedback !== null && (
        <TouchableOpacity testID="next-button" style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>次へ</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  question: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  choices: {
    width: '100%',
    gap: 12,
  },
  choiceButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 20,
  },
  feedbackContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  feedbackCorrect: {
    backgroundColor: '#d4edda',
  },
  feedbackIncorrect: {
    backgroundColor: '#f8d7da',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  feedbackTextCorrect: {
    color: '#155724',
  },
  feedbackTextIncorrect: {
    color: '#721c24',
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#721c24',
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
