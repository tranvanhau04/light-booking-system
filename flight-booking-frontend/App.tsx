import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import AppNavigation from "./src/navigation/AppNavigator"

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppNavigation />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  )
}