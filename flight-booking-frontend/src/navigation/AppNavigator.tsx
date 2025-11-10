import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import screens
import HomeDestinationListingScreen from "../screens/Home-DestinationListingScreen";
import FlightSearchScreen from "../screens/FlightSearching";
import FlightBookingSearchResults from "../screens/FlightBooking-SearchResults";
import FlightListScreen from "../screens/FlightListScreen";
import FlightDetailsScreen from "../screens/FlightDetailsScreen";
import CheckoutPassengerInformation from "../screens/CheckoutPassengerInformation";
import CheckoutBaggageInformation from "../screens/CheckoutBaggageInformation";
import CheckoutSeatInformation from "../screens/CheckoutSeatInformation";
import CheckoutSelectSeats from "../screens/CheckoutSelectSeats";
import CheckoutPayment from "../screens/CheckoutPayment";
import CheckoutPaymentSuccess from "../screens/CheckoutPaymentSuccess";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import BookingDetailScreen from "../screens/BookingDetailScreen";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  FlightSearch: undefined;
  FlightBookingSearchResults: Record<string, unknown>;
  List: Record<string, unknown>;
  FlightBookingDetails: Record<string, unknown>;
  CheckoutPassengerInformation: Record<string, unknown>;
  CheckoutBaggageInformation: undefined;
  CheckoutSeatInformation: undefined;
  CheckoutSelectSeats: Record<string, unknown>;
  CheckoutPayment: undefined;
  CheckoutPaymentSuccess: Record<string, unknown>;
  BookingDetail: Record<string, unknown>;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  FlightBookingSearchResults: Record<string, unknown>;
  List: Record<string, unknown>;
  FlightBookingDetails: Record<string, unknown>;
  CheckoutPassengerInformation: Record<string, unknown>;
  CheckoutBaggageInformation: undefined;
  CheckoutSeatInformation: undefined;
  CheckoutSelectSeats: Record<string, unknown>;
  CheckoutPayment: undefined;
  CheckoutPaymentSuccess: Record<string, unknown>;
  BookingDetail: Record<string, unknown>;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

// ============================================================================
// NAVIGATORS
// ============================================================================

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const SearchStackNav = createNativeStackNavigator<SearchStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
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
      <HomeStackNav.Screen name="BookingDetail" component={BookingDetailScreen} />
    </HomeStackNav.Navigator>
  );
}

function SearchStack() {
  return (
    <SearchStackNav.Navigator screenOptions={{ headerShown: false }}>
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
      <SearchStackNav.Screen name="BookingDetail" component={BookingDetailScreen} />
    </SearchStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStackNav.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "compass" : "compass-outline";
              break;
            case "Profile":
              iconName = focused ? "account" : "account-outline";
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
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
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Home" }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ title: "Explore" }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
    </RootStack.Navigator>
  );
}
