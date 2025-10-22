import React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import FlightCard from "../components/FlightCard";
import flights from "../data/flights.json";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type ListScreenNavProp = StackNavigationProp<RootStackParamList, "List">;
type ListScreenRouteProp = RouteProp<RootStackParamList, "List">;

export default function FlightListScreen() {
  const nav = useNavigation<ListScreenNavProp>();
  const route = useRoute<ListScreenRouteProp>();
  const { from, to } = route.params;

  const filtered = flights.filter(
    (f) => f.from === from && f.to === to
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FlightCard
            flight={item}
            onPress={() => nav.navigate("Detail", { flight: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 10,
  },
});
