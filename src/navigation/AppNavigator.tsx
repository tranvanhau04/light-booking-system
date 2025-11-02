// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "../screens/Home-DestinationListingScreen";
// import FlightSearchScreen from "../screens/FlightSearching";
// import FlightListScreen from "../screens/FlightListScreen";
// import FlightBookingSearchResults from "../screens/FlightBooking-SearchResults";
// import FlightDetailsScreen from "../screens/FlightDetailsScreen";

// export type RootStackParamList = {
//   Home: undefined;
//   Search: undefined;
//   List: { from: string; to: string };
//   FlightBookingSearchResults: {
//     from: string;
//     to: string;
//     departDate: string;
//     returnDate: string;
//     tripType: 'round-trip' | 'one-way' | 'multi-city';
//     passengers: {
//       adults: number;
//       children: number;
//       infants: number;
//     };
//     cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
//   };
//    FlightBookingDetails: {
//     flightId: string;
//   };
// };
// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <Stack.Navigator 
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: '#fff',
//         },
//         headerTintColor: '#000',
//       }}
//     >
//       <Stack.Screen 
//         name="Home" 
//         component={HomeScreen} 
//         options={{ headerShown: false }} 
//       />
//       <Stack.Screen 
//         name="Search" 
//         component={FlightSearchScreen} 
//         options={{ headerShown: false }} 
//       />
//       <Stack.Screen 
//         name="List" 
//         component={FlightListScreen} 
//         options={{ headerShown: false }} 
//       />
//       <Stack.Screen 
//         name="FlightBookingSearchResults" 
//         component={FlightBookingSearchResults}
//         options={{ headerShown: false }}
//       />  
//          <Stack.Screen 
//         name="FlightBookingDetails" 
//         component={FlightDetailsScreen}
//         options={{
//           animation: 'slide_from_right',
//         }}
//       />
//     </Stack.Navigator>
//   );
// }
