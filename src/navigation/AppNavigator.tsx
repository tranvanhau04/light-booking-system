import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// Import screens
import HomeDestinationListingScreen from "../screens/Home-DestinationListingScreen"
import FlightSearchScreen from "../screens/FlightSearching"
import FlightBookingSearchResults from "../screens/FlightBooking-SearchResults"
import FlightListScreen from "../screens/FlightListScreen"
import FlightDetailsScreen from "../screens/FlightDetailsScreen"
import CheckoutPassengerInformation from "../screens/CheckoutPassengerInformation"
import CheckoutBaggageInformation from "../screens/CheckoutBaggageInformation"
import CheckoutSeatInformation from "../screens/CheckoutSeatInformation"
import CheckoutSelectSeats from "../screens/CheckoutSelectSeats"
import CheckoutPayment from "../screens/CheckoutPayment"
import CheckoutPaymentSuccess from "../screens/CheckoutPaymentSuccess"
import ProfileScreen from "../screens/ProfileScreen"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Tab Navigator types
export type RootTabParamList = {
  Home: undefined
  Search: undefined
  Profile: undefined
}

// Home Stack Navigator types
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

// Search Stack Navigator types
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

// Profile Stack Navigator types
export type ProfileStackParamList = {
  ProfileMain: undefined
  EditProfile: undefined
  Security: undefined
  Notifications: undefined
  PaymentMethods: undefined
  Wallet: undefined
  Transactions: undefined
  HelpCenter: undefined
  AboutUs: undefined
  PrivacyPolicy: undefined
}

// Export prop types for screens
export type FlightBookingSearchResultsProps = NativeStackScreenProps<
  HomeStackParamList,
  "FlightBookingSearchResults"
>
export type FlightListScreenProps = NativeStackScreenProps<HomeStackParamList, "List">
export type FlightDetailScreenProps = NativeStackScreenProps<HomeStackParamList, "FlightBookingDetails">

// ============================================================================
// NAVIGATORS
// ============================================================================

const Tab = createBottomTabNavigator<RootTabParamList>()
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>()
const SearchStackNav = createNativeStackNavigator<SearchStackParamList>()
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>()

// Home Stack with all flight-related screens
function HomeStack() {
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStackNav.Screen name="HomeMain" component={HomeDestinationListingScreen} />
      <HomeStackNav.Screen name="FlightSearch" component={FlightSearchScreen} />
      <HomeStackNav.Screen name="FlightBookingSearchResults" component={FlightBookingSearchResults} />
      <HomeStackNav.Screen name="List" component={FlightListScreen} />
      <HomeStackNav.Screen name="FlightBookingDetails" component={FlightDetailsScreen} />
      <HomeStackNav.Screen name="CheckoutPassengerInformation" component={CheckoutPassengerInformation} />
      <HomeStackNav.Screen name="CheckoutBaggageInformation" component={CheckoutBaggageInformation} />
      <HomeStackNav.Screen name="CheckoutSeatInformation" component={CheckoutSeatInformation} />
      <HomeStackNav.Screen name="CheckoutSelectSeats" component={CheckoutSelectSeats} />
      <HomeStackNav.Screen name="CheckoutPayment" component={CheckoutPayment} />
      <HomeStackNav.Screen name="CheckoutPaymentSuccess" component={CheckoutPaymentSuccess} />
    </HomeStackNav.Navigator>
  )
}

// Search Stack
function SearchStack() {
  return (
    <SearchStackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStackNav.Screen name="SearchMain" component={FlightSearchScreen} />
      <SearchStackNav.Screen name="FlightBookingSearchResults" component={FlightBookingSearchResults} />
      <SearchStackNav.Screen name="List" component={FlightListScreen} />
      <SearchStackNav.Screen name="FlightBookingDetails" component={FlightDetailsScreen} />
      <SearchStackNav.Screen name="CheckoutPassengerInformation" component={CheckoutPassengerInformation} />
      <SearchStackNav.Screen name="CheckoutBaggageInformation" component={CheckoutBaggageInformation} />
      <SearchStackNav.Screen name="CheckoutSeatInformation" component={CheckoutSeatInformation} />
      <SearchStackNav.Screen name="CheckoutSelectSeats" component={CheckoutSelectSeats} />
      <SearchStackNav.Screen name="CheckoutPayment" component={CheckoutPayment} />
      <SearchStackNav.Screen name="CheckoutPaymentSuccess" component={CheckoutPaymentSuccess} />
    </SearchStackNav.Navigator>
  )
}

// Profile Stack
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
      {/* Các screen khác sẽ được thêm sau khi tạo */}
    </ProfileStackNav.Navigator>
  )
}

// ============================================================================
// MAIN TAB NAVIGATOR
// ============================================================================

export default function AppNavigation() {
  return (
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
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  )
}