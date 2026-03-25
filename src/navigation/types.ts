import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
  Home: undefined
  Session: undefined
  Result: {
    correctCount: number
    missedProblemIds: string[]
  }
}

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type SessionScreenProps = NativeStackScreenProps<RootStackParamList, 'Session'>
export type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>
