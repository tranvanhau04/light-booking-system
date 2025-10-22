import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import FlightSearchScreen from "../screens/FlightSearchScreen";
import FlightListScreen from "../screens/FlightListScreen";
import FlightDetailScreen from "../screens/FlightDetailScreen";

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  List: { from: string; to: string };
  Detail: { flight: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Search" component={FlightSearchScreen} />
      <Stack.Screen name="List" component={FlightListScreen} />
      <Stack.Screen name="Detail" component={FlightDetailScreen} />
    </Stack.Navigator>
  );
}
