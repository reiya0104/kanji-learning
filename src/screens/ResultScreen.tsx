import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import type { ResultScreenProps } from '../navigation/types'
import { getAllProblems } from '../infrastructure/problemRepository'

export default function ResultScreen({ route, navigation }: ResultScreenProps) {
  const { correctCount, missedProblemIds, masteredProblemIds } = route.params
  const allProblems = getAllProblems()
  const missedProblems = allProblems.filter((p) => missedProblemIds.includes(p.id))
  const masteredProblems = allProblems.filter((p) => masteredProblemIds.includes(p.id))

  return (
    <View style={styles.container}>
      <Text testID="correct-count">{correctCount} / 10</Text>
      {masteredProblems.length > 0 && (
        <View testID="mastered-section">
          <Text>苦手克服！</Text>
          <FlatList
            data={masteredProblems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Text>{item.question}</Text>}
          />
        </View>
      )}
      <FlatList
        data={missedProblems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.question}</Text>}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Session')}>
        <Text>もう一度</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text>終了</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
