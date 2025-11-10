"use client"

import { useMemo } from "react"
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, ActivityIndicator } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useBooking } from "../context/BookingContext"

export default function CheckoutSeatInformation({ navigation }: any) {
  // === 1. LẤY DATA TỪ KHO CHỨA ===
  const { bookingData, setSelectedSeatsData } = useBooking()

  // Lấy data của cả 2 chuyến
  const outboundFlight = bookingData.outboundFlight
  const inboundFlight = bookingData.inboundFlight

  // === 2. LẤY GHẾ ĐÃ CHỌN TỪ CONTEXT ===
  const outboundSeat = bookingData.selectedSeats.find((s: any) => s.flightId === outboundFlight?.flightId)
  const inboundSeat = bookingData.selectedSeats.find((s: any) => s.flightId === inboundFlight?.flightId)

  // Lấy số lượng người lớn
  const adultCount = bookingData.passengersData?.adults || 1

  // === 3. TÍNH TOÁN GIÁ (ĐỘNG) ===
  const { totalPrice, passengerCount } = useMemo(() => {
    const basePrice = bookingData.totalPrice || 0
    const seatCost = bookingData.selectedSeats.reduce((sum: number, s: any) => sum + (s.price || 0), 0)
    const bagCost = bookingData.selectedBaggage?.reduce((sum: number, b: any) => sum + (b.price || 0), 0) || 0
    const total = basePrice + seatCost + bagCost
    const count = bookingData.passengersData?.adults || 1
    return { totalPrice: total, passengerCount: count }
  }, [bookingData])

  // === 4. HÀM handleSelectSeats ===
  const handleSelectSeats = (flightId: string, cabinId: string, flightRoute: string) => {
    navigation.navigate("CheckoutSelectSeats", {
      flightId: flightId,
      cabinId: cabinId,
      flightRoute: flightRoute,
      passengerCount: adultCount,
    })
  }

  // === 5. HÀM handleNext ===
  const handleNext = () => {
    if (!outboundSeat && adultCount > 0) {
      Alert.alert("Chọn Ghế", "Vui lòng chọn ghế cho chuyến đi.")
      return
    }
    if (inboundFlight && !inboundSeat && adultCount > 0) {
      Alert.alert("Chọn Ghế", "Vui lòng chọn ghế cho chuyến về.")
      return
    }
    navigation.navigate("CheckoutPayment")
  }

  // === 6. HÀM navigateToStep ===
  const navigateToStep = (step: number) => {
    if (step === 1) navigation.navigate("CheckoutPassengerInformation")
    if (step === 2) navigation.navigate("CheckoutBaggageInformation")
    if (step === 4) handleNext()
  }

  if (!outboundFlight) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 50 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          {/* Progress steps */}
          <View style={styles.stepsRow}>
            {/* 1. Passenger (Completed) */}
            <TouchableOpacity onPress={() => navigateToStep(1)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLineActive} />
            {/* 2. Baggage (Completed) */}
            <TouchableOpacity onPress={() => navigateToStep(2)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="briefcase" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLineActive} />
            {/* 3. Seat (Active) */}
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="sofa" size={20} color="#fff" />
            </View>
            <View style={styles.stepLine} />
            {/* 4. Payment (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(4)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons name="calendar-outline" size={24} color="#6b7280" />
        </View>
        <Text style={styles.pageTitle}>Seat</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* === CHUYẾN BAY ĐI (Outbound) === */}
        {outboundFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Flight to{" "}
              {outboundFlight.arrivalAirport.split("(")[1]?.replace(")", "") ||
                outboundFlight.arrivalAirport.split(" ")[0]}
            </Text>
            <View style={outboundSeat ? styles.flightCardSelected : styles.flightCard}>
              <View style={styles.flightLeft}>
                <View style={styles.flightIcon}>
                  <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color="#6b7280" />
                </View>
                <View style={styles.flightInfo}>
                  <Text style={styles.flightRoute}>
                    {outboundFlight.departureAirport.split("(")[1]?.replace(")", "") ||
                      outboundFlight.departureAirport.split(" ")[0]}{" "}
                    -{" "}
                    {outboundFlight.arrivalAirport.split("(")[1]?.replace(")", "") ||
                      outboundFlight.arrivalAirport.split(" ")[0]}
                  </Text>
                  <Text style={styles.flightPrice}>
                    {outboundSeat
                      ? `Seat ${outboundSeat.row}${outboundSeat.column} ($${outboundSeat.price.toFixed(2)})`
                      : "Seats from $5"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.selectButtonContainer}
                onPress={() =>
                  handleSelectSeats(
                    outboundFlight.flightId,
                    "C01",
                    `${outboundFlight.departureAirport} - ${outboundFlight.arrivalAirport}`,
                  )
                }
              >
                <Text style={styles.selectButtonText}>{outboundSeat ? "Change" : "Select"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* === CHUYẾN BAY VỀ (Inbound) === */}
        {inboundFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Flight to{" "}
              {inboundFlight.arrivalAirport.split("(")[1]?.replace(")", "") ||
                inboundFlight.arrivalAirport.split(" ")[0]}
            </Text>
            <View style={inboundSeat ? styles.flightCardSelected : styles.flightCard}>
              <View style={styles.flightLeft}>
                <View style={styles.flightIcon}>
                  <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color="#6b7280" />
                </View>
                <View style={styles.flightInfo}>
                  <Text style={styles.flightRoute}>
                    {inboundFlight.departureAirport.split("(")[1]?.replace(")", "") ||
                      inboundFlight.departureAirport.split(" ")[0]}{" "}
                    -{" "}
                    {inboundFlight.arrivalAirport.split("(")[1]?.replace(")", "") ||
                      inboundFlight.arrivalAirport.split(" ")[0]}
                  </Text>
                  <Text style={styles.flightPrice}>
                    {inboundSeat
                      ? `Seat ${inboundSeat.row}${inboundSeat.column} ($${inboundSeat.price.toFixed(2)})`
                      : "Seats from $4.59"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.selectButtonContainer}
                onPress={() =>
                  handleSelectSeats(
                    inboundFlight.flightId,
                    "C01",
                    `${inboundFlight.departureAirport} - ${inboundFlight.arrivalAirport}`,
                  )
                }
              >
                <Text style={styles.selectButtonText}>{inboundSeat ? "Change" : "Select"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 16,
  },
  stepActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  stepLineActive: {
    width: 24,
    height: 2,
    backgroundColor: "#06b6d4",
    marginHorizontal: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  flightCardSelected: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#06b6d4",
    marginBottom: 16,
  },
  flightLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flightIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flightInfo: {
    flex: 1,
  },
  flightRoute: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  flightPrice: {
    fontSize: 13,
    color: "#9ca3af",
  },
  selectButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a855f7",
  },
  infoBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#93c5fd",
    flexDirection: "row",
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  priceLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  nextButton: {
    borderRadius: 8,
    paddingHorizontal: 48,
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
})
