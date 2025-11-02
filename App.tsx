import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Provider as PaperProvider } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// Import screens
import HomeDestinationListingScreen from "./src/screens/Home-DestinationListingScreen"
import FlightSearchScreen from "./src/screens/FlightSearching"
import FlightBookingSearchResults from "./src/screens/FlightBooking-SearchResults"
import FlightListScreen from "./src/screens/FlightListScreen"
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen"
import CheckoutPassengerInformation from "./src/screens/CheckoutPassengerInformation"
import CheckoutBaggageInformation from "./src/screens/CheckoutBaggageInformation"
import CheckoutSeatInformation from "./src/screens/CheckoutSeatInformation"
import CheckoutSelectSeats from "./src/screens/CheckoutSelectSeats"
import CheckoutPayment from "./src/screens/CheckoutPayment"
import CheckoutPaymentSuccess from "./src/screens/CheckoutPaymentSuccess"


// Define Tab Navigator types
export type RootTabParamList = {
  Home: undefined
  Search: undefined
  Bookings: undefined
  Profile: undefined
}

// Define Home Stack Navigator types
export type HomeStackParamList = {
  HomeMain: undefined
  FlightSearch: undefined
  FlightBookingSearchResults: {
    from: string
    to: string
    departDate: string
    returnDate?: string
    tripType: "round-trip" | "one-way" | "multi-city"
    passengers: {
      adults: number
      children: number
      infants: number
    }
    cabinClass: "Economy" | "Premium Economy" | "Business" | "First"
  }
  List: {
    from: string
    to: string
  }
  FlightBookingDetails: {
    flightId: string
  }
  CheckoutPassengerInformation: {
    flightId: string
    flightDetails: any
  }
  CheckoutBaggageInformation: undefined
  CheckoutSeatInformation: undefined
  CheckoutSelectSeats: {
    flightRoute: string
    flightType: string
  }
  CheckoutPayment: undefined
    CheckoutPaymentSuccess: {
    bookingId: string
    departure: string
    arrival: string
    departDate: string
    returnDate: string
    traveller: string
    flightClass: string
    tripType: string
    totalPrice: string
  }
}

// Define Search Stack Navigator types
export type SearchStackParamList = {
  SearchMain: undefined
  FlightBookingSearchResults: {
    from: string
    to: string
    departDate: string
    returnDate?: string
    tripType: "round-trip" | "one-way" | "multi-city"
    passengers: {
      adults: number
      children: number
      infants: number
    }
    cabinClass: "Economy" | "Premium Economy" | "Business" | "First"
  }
  List: {
    from: string
    to: string
  }
  FlightBookingDetails: {
    flightId: string
  }
  CheckoutPassengerInformation: {
    flightId: string
    flightDetails: any
  }
  CheckoutBaggageInformation: undefined
  CheckoutSeatInformation: undefined
  CheckoutSelectSeats: {
    flightRoute: string
    flightType: string
  }
  CheckoutPayment: undefined
    CheckoutPaymentSuccess: {
    bookingId: string
    departure: string
    arrival: string
    departDate: string
    returnDate: string
    traveller: string
    flightClass: string
    tripType: string
    totalPrice: string
  }
}

// Export prop types for screens
export type FlightBookingSearchResultsProps = NativeStackScreenProps<HomeStackParamList, "FlightBookingSearchResults">
export type FlightListScreenProps = NativeStackScreenProps<HomeStackParamList, "List">
export type FlightDetailScreenProps = NativeStackScreenProps<HomeStackParamList, "FlightBookingDetails">

const Tab = createBottomTabNavigator<RootTabParamList>()
const Stack = createNativeStackNavigator<HomeStackParamList>()
const SearchStackNavigator = createNativeStackNavigator<SearchStackParamList>()

// Home Stack with all flight-related screens
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeDestinationListingScreen} />
      <Stack.Screen name="FlightSearch" component={FlightSearchScreen} />
      <Stack.Screen name="FlightBookingSearchResults" component={FlightBookingSearchResults} />
      <Stack.Screen name="List" component={FlightListScreen} />
      <Stack.Screen name="FlightBookingDetails" component={FlightDetailsScreen} />
      <Stack.Screen name="CheckoutPassengerInformation" component={CheckoutPassengerInformation} />
      <Stack.Screen name="CheckoutBaggageInformation" component={CheckoutBaggageInformation} />
      <Stack.Screen name="CheckoutSeatInformation" component={CheckoutSeatInformation} />
      <Stack.Screen name="CheckoutSelectSeats" component={CheckoutSelectSeats} />
      <Stack.Screen name="CheckoutPayment" component={CheckoutPayment} />
      <Stack.Screen name="CheckoutPaymentSuccess" component={CheckoutPaymentSuccess} />
    </Stack.Navigator>
  )
}

function SearchStack() {
  return (
    <SearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStackNavigator.Screen name="SearchMain" component={FlightSearchScreen} />
      <SearchStackNavigator.Screen name="FlightBookingSearchResults" component={FlightBookingSearchResults} />
      <SearchStackNavigator.Screen name="List" component={FlightListScreen} />
      <SearchStackNavigator.Screen name="FlightBookingDetails" component={FlightDetailsScreen} />
      <SearchStackNavigator.Screen name="CheckoutPassengerInformation" component={CheckoutPassengerInformation} />
      <SearchStackNavigator.Screen name="CheckoutBaggageInformation" component={CheckoutBaggageInformation} />
      <SearchStackNavigator.Screen name="CheckoutSeatInformation" component={CheckoutSeatInformation} />
      <SearchStackNavigator.Screen name="CheckoutSelectSeats" component={CheckoutSelectSeats} />
      <SearchStackNavigator.Screen name="CheckoutPayment" component={CheckoutPayment} />
      <SearchStackNavigator.Screen name="CheckoutPaymentSuccess" component={CheckoutPaymentSuccess} />
    </SearchStackNavigator.Navigator>
  )
}

// Main Tab Navigator
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string

              switch (route.name) {
                case "Home":
                  iconName = focused ? "home" : "home-outline"
                  break
                case "Search":
                  iconName = focused ? "compass" : "compass-outline"
                  break
                case "Bookings":
                  iconName = focused ? "ticket" : "ticket-outline"
                  break
                case "Profile":
                  iconName = focused ? "account" : "account-outline"
                  break
                default:
                  iconName = "circle"
              }

              return <Icon name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: "#00BCD4",
            tabBarInactiveTintColor: "#999",
            headerShown: false,
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{ title: "Home" }} />
          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              title: "Explore",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}