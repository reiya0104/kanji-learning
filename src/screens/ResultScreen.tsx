import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import type { ResultScreenProps } from '../navigation/types'
import { getAllProblems } from '../infrastructure/problemRepository'
import { FONTS } from '../constants/fonts'

export default function ResultScreen({ route, navigation }: ResultScreenProps) {
  const { correctCount, missedProblemIds, masteredProblemIds } = route.params
  const allProblems = getAllProblems()
  const missedProblems = allProblems.filter((p) => missedProblemIds.includes(p.id))
  const masteredProblems = allProblems.filter((p) => masteredProblemIds.includes(p.id))

  return (
    <View style={styles.container}>
      <Text testID="correct-count" style={styles.text}>{correctCount} / 10</Text>
      {masteredProblems.length > 0 && (
        <View testID="mastered-section">
          <Text style={styles.text}>苦手克服！</Text>
          <FlatList
            data={masteredProblems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Text style={styles.text}>{item.question}</Text>}
          />
        </View>
      )}
      <FlatList
        data={missedProblems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.text}>{item.question}</Text>}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Session')}>
        <Text style={styles.text}>もう一度</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.text}>終了</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: FONTS.regular },
})
