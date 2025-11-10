import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import AppNavigation from "./src/navigation/AppNavigator" // Sửa đường dẫn nếu cần
import { BookingProvider } from "./src/context/BookingContext"
// === 1. IMPORT AUTH PROVIDER MỚI ===
import { AuthProvider } from "./src/context/AuthContext"

export default function App() {
  return (
    <PaperProvider>
      {/* === 2. BỌC AUTH PROVIDER NGOÀI CÙNG === */}
      <AuthProvider>
        <BookingProvider> 
          <NavigationContainer>
            <AppNavigation />
            <StatusBar style="auto" />
          </NavigationContainer>
        </BookingProvider> 
      </AuthProvider>
    </PaperProvider>
  )
}