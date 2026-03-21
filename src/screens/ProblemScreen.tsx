import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { Problem } from '../domain/problem'

type Props = {
  problem: Problem
  onAnswer: (choice: string) => void
}

export default function ProblemScreen({ problem, onAnswer }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{problem.question}</Text>
      <View style={styles.choices}>
        {problem.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.choiceButton}
            onPress={() => onAnswer(choice)}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
})
