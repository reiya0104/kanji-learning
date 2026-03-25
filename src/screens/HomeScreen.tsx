import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { HomeScreenProps } from '../navigation/types'

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>漢字学習アプリ</Text>
      <TouchableOpacity
        testID="start-session-button"
        style={styles.button}
        onPress={() => navigation.navigate('Session')}
      >
        <Text style={styles.buttonText}>セッション開始</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  button: { backgroundColor: '#4A90E2', borderRadius: 8, padding: 16 },
  buttonText: { color: '#fff', fontSize: 18 },
})
