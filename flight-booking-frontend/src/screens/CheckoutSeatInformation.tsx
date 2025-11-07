import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext'; // <-- IMPORT CONTEXT

export default function CheckoutSeatInformation({ navigation }: any) {
  // === 1. LẤY DATA TỪ KHO CHỨA ===
  const { bookingData, setSelectedSeatsData } = useBooking();
  
  // Lấy data của cả 2 chuyến
  const outboundFlight = bookingData.outboundFlight;
  const inboundFlight = bookingData.inboundFlight;

  // === 2. LẤY GHẾ ĐÃ CHỌN TỪ CONTEXT ===
  // (Chúng ta cần biết ghế nào đã được chọn để hiển thị "Selected")
  const outboundSeat = bookingData.selectedSeats.find(
    (s) => s.flightId === outboundFlight?.flightId
  );
  const inboundSeat = bookingData.selectedSeats.find(
    (s) => s.flightId === inboundFlight?.flightId
  );

  // === 3. TÍNH TOÁN GIÁ (ĐỘNG) ===
  const { totalPrice, passengerCount } = useMemo(() => {
    // Giả sử basePrice là giá khứ hồi đã có trong 'outboundFlight'
    const baseRoundTrip = outboundFlight?.basePrice || 0; 
    
    const seat = bookingData.selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
    const bagPrice = bookingData.baggage?.price || 0;
    const protectionPrice = bookingData.protection ? 19.99 : 0; // (Giá bảo hiểm)

    // (Lưu ý: Giá $806 trong UI là giá gốc, $825.99 là giá đã cộng)
    const total = baseRoundTrip + seat + bagPrice + protectionPrice;
    const count = bookingData.passengers.length || 1;

    return { totalPrice: total, passengerCount: count };
  }, [bookingData]);

  // === 4. SỬA HÀM handleSelectSeats ===
  const handleSelectSeats = (flightId: string, cabinId: string, flightRoute: string) => {
    navigation.navigate('CheckoutSelectSeats', {
      flightId: flightId,
      cabinId: cabinId,
      flightRoute: flightRoute,
    });
  };

  // === 5. SỬA HÀM handleNext ===
  const handleNext = () => {
    // (Bạn có thể thêm logic kiểm tra xem đã chọn đủ ghế chưa ở đây)
    navigation.navigate('CheckoutPayment');
  };

  // === 6. HÀM navigateToStep (Sửa luồng) ===
  const navigateToStep = (step: number) => {
    if (step === 1) navigation.navigate('CheckoutPassengerInformation');
    if (step === 2) navigation.navigate('CheckoutBaggageInformation');
    if (step === 4) handleNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Thanh tiến độ của bạn đã đúng) */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          {/* Progress steps (Đã sửa luồng) */}
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
        </View>
        <Text style={styles.pageTitle}>Seat</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* === 7. HIỂN THỊ CHUYẾN BAY ĐI (Outbound) === */}
        {outboundFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {/* Sửa lại tiêu đề cho giống UI */}
              Flight to {outboundFlight.arrivalAirport.split(' ')[0]} 
            </Text>
            {/* Dùng style 'Selected' nếu ghế đã được chọn */}
            <View style={outboundSeat ? styles.flightCardSelected : styles.flightCard}>
              <View style={styles.flightLeft}>
                <View style={styles.flightIcon}>
                  {/* Icon xe lăn giống UI */}
                  <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color="#6b7280" />
                </View>
                <View>
                  <Text style={styles.flightRoute}>
                    {outboundFlight.flightCode} {/* (LCY - JFK) */}
                  </Text>
                  <Text style={styles.flightPrice}>
                    {outboundSeat 
                      ? `Seat ${outboundSeat.row}${outboundSeat.column} ($${outboundSeat.price.toFixed(2)})` 
                      : 'Seats from $5'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() =>
                  handleSelectSeats(
                    outboundFlight.flightId,
                    'C01', // (Giả sử Economy 'C01')
                    `${outboundFlight.departureAirport} - ${outboundFlight.arrivalAirport}`
                  )
                }
              >
                <Text style={styles.selectButtonText}>
                  {outboundSeat ? 'Change' : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* === 8. HIỂN THỊ CHUYẾN BAY VỀ (Inbound) === */}
        {inboundFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Flight to {inboundFlight.arrivalAirport.split(' ')[0]}
            </Text>
            <View style={inboundSeat ? styles.flightCardSelected : styles.flightCard}>
              <View style={styles.flightLeft}>
                <View style={styles.flightIcon}>
                  <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color="#6b7280" />
                </View>
                <View>
                  <Text style={styles.flightRoute}>
                    {inboundFlight.flightCode} {/* (JFK - LCY) */}
                  </Text>
                  <Text style={styles.flightPrice}>
                    {inboundSeat 
                      ? `Seat ${inboundSeat.row}${inboundSeat.column} ($${inboundSeat.price.toFixed(2)})` 
                      : 'Seats from $4.59'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() =>
                  handleSelectSeats(
                    inboundFlight.flightId,
                    'C01', // (Giả sử Economy 'C01')
                    `${inboundFlight.departureAirport} - ${inboundFlight.arrivalAirport}`
                  )
                }
              >
                <Text style={styles.selectButtonText}>
                  {inboundSeat ? 'Change' : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Box (Giữ nguyên) */}
        <View style={styles.infoBox}>
          {/* ... (UI cũ) ... */}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer (Sửa lại giá tiền) */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
          <Text style={styles.priceLabel}>{passengerCount} adult</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          labelStyle={styles.nextButtonLabel}
          buttonColor="#06b6d4"
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
}

// === 9. SỬA STYLES ===
const styles = StyleSheet.create({
  // ... (Tất cả styles cũ)
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // THÊM STYLE MỚI NÀY ĐỂ HIGHLIGHT KHI ĐÃ CHỌN
  flightCardSelected: {
    backgroundColor: '#f0f9ff', // Màu nền xanh nhạt
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#06b6d4', // Viền xanh
  },
  // ... (Tất cả styles cũ)
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
    marginRight: 40,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  content: { 
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
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
  flightRoute: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  flightPrice: {
    fontSize: 13,
    color: "#6b7280",
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7c3aed",
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
    fontSize: 24, 
    fontWeight: "700",
    color: "#111827",
  },
  priceLabel: { 
    fontSize: 12, 
    color: "#6b7280",
    marginTop: 2,
  },
  nextButton: {
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  nextButtonLabel: { 
    fontSize: 16, 
    fontWeight: "600",
  },
});