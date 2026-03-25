import { View, Text, StyleSheet } from 'react-native'
import type { ResultScreenProps } from '../navigation/types'

export default function ResultScreen({ route }: ResultScreenProps) {
  const { correctCount, missedProblemIds } = route.params
  return (
    <View style={styles.container}>
      <Text testID="correct-count">正解数: {correctCount}</Text>
      <Text testID="missed-count">間違えた問題数: {missedProblemIds.length}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
