import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import InputField from "../components/InputField";
import ButtonPrimary from "../components/ButtonPrimary";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type SearchScreenNavProp = StackNavigationProp<RootStackParamList, "Search">;

export default function FlightSearchScreen() {
  const nav = useNavigation<SearchScreenNavProp>();
  const [from, setFrom] = useState("Hanoi");
  const [to, setTo] = useState("Ho Chi Minh");

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <InputField
          label="From"
          value={from}
          onChangeText={setFrom}
          placeholder="Enter departure city"
        />
        <InputField
          label="To"
          value={to}
          onChangeText={setTo}
          placeholder="Enter destination city"
        />
      </View>

      <View style={{ marginTop: 18 }}>
        <ButtonPrimary
          title="Show Flights"
          onPress={() => nav.navigate("List", { from, to })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
