import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function FlightDetailScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { flight }: any = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{flight.airline}</Text>
      <Text style={styles.subtitle}>
        {flight.from} → {flight.to}
      </Text>
      <Text style={styles.info}>Time: {flight.time}</Text>
      <Text style={styles.info}>Price: ${flight.price}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => nav.navigate("Home" as never)}
      >
        <Text style={styles.buttonText}>Book This Flight</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
    color: "#555",
  },
  info: {
    fontSize: 16,
    marginTop: 6,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#1e88e5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
