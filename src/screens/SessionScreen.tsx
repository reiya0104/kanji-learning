import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { SessionScreenProps } from '../navigation/types'

export default function SessionScreen({ navigation }: SessionScreenProps) {
  return (
    <View style={styles.container}>
      <Text>セッション画面（実装予定）</Text>
      <TouchableOpacity
        testID="go-to-result-button"
        onPress={() =>
          navigation.navigate('Result', { correctCount: 0, missedProblemIds: [] })
        }
      >
        <Text>結果へ（仮）</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
