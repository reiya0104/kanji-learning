import { NavigationContainer } from '@react-navigation/native'
import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp'
import { useFonts } from 'expo-font'
import RootNavigator from './src/navigation/RootNavigator'
import { FONTS } from './src/constants/fonts'

export default function App() {
  const [loaded] = useFonts({
    [FONTS.regular]: NotoSansJP_400Regular,
    [FONTS.bold]: NotoSansJP_700Bold,
  })

  if (!loaded) {
    return null
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}
