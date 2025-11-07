import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import AppNavigation from "./src/navigation/AppNavigator"
import { BookingProvider } from "./src/context/BookingContext" // <-- 1. IMPORT

export default function App() {
  return (
    <PaperProvider>
      <BookingProvider> {/* <-- 2. BỌC Ở BÊN NGOÀI */}
        <NavigationContainer>
          <AppNavigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </BookingProvider> {/* <-- 3. ĐÓNG BỌC */}
    </PaperProvider>
  )
}