import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from './types'
import HomeScreen from '../screens/HomeScreen'
import SessionScreen from '../screens/SessionScreen'
import ResultScreen from '../screens/ResultScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  )
}
