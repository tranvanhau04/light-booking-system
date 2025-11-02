import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import FlightCard from "../components/FlightCard";
import flights from "../data/flights.json";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function FlightListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { from, to } = route.params || { from: 'London', to: 'New York' };

  // Lọc danh sách chuyến bay
const filtered = flights.flights.filter(
  (f) => f.departureCity === from && f.arrivalCity === to
);



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.routeText}>{from} - {to}</Text>
          <Text style={styles.subText}>Jul 14 - Jul 17, 1 traveller</Text>
        </View>
        <Ionicons
          name="notifications-outline"
          size={22}
          color="black"
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Sort & Filters row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={16} color="black" />
          <Text style={styles.filterText}> Sort & Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.simpleButton}>
          <Text style={styles.filterText}>Best</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.simpleButton}>
          <Text style={styles.filterText}>Stops</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.simpleButton}>
          <Text style={styles.filterText}>Time</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách chuyến bay */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <FlightCard
            flight={item}
            onPress={() => navigation.navigate('FlightBookingDetails', { flightId: item.id })}
          />
        )}
        
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No flights found for this route.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    fontSize: 13,
    color: "#6b7280",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  simpleButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 14,
  },
});