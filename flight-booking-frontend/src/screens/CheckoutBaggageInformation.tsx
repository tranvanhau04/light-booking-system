import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext';
// === 1. IMPORT SERVICE MỚI ===
import { getBaggageOptions, BaggageOption } from '../services/optionsService'; 

// (Giá bảo hiểm vẫn tạm hard-code)
const INSURANCE_PRICE = 19.99; 

export default function CheckoutBaggageInformation({ navigation }: any) {
  const { bookingData, setBaggageData, setProtectionData } = useBooking();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baggageOptions, setBaggageOptions] = useState<BaggageOption[]>([]);

  // Lấy giá trị đã lưu trong context
  const [checkedBagId, setCheckedBagId] = useState<string | null>(
    bookingData.baggage?.optionId || null // <-- SỬA LỖI: Dùng 'optionId'
  );
  const [travelProtection, setTravelProtection] = useState(
    () => (bookingData.protection ? 'with-insurance' : 'no-insurance')
  );

  // === 2. GỌI API ĐỂ LẤY DATA HÀNH LÝ ===
  useEffect(() => {
    const fetchBaggageOptions = async () => {
      try {
        setLoading(true);
        const data = await getBaggageOptions(); // <-- Gọi API
        setBaggageOptions(data);
        
        // Tự động chọn "No Checked" nếu chưa chọn gì
        if (!checkedBagId) {
          const noBag = data.find((b) => b.type === 'No Checked');
          if (noBag) setCheckedBagId(noBag.optionId); // <-- SỬA LỖI: Dùng 'optionId'
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu hành lý.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBaggageOptions();
  }, []); // Chỉ chạy 1 lần

  const protectionFeatures = [
    'Laboris exercitation Lorem anim pariatur',
    'Duis aute irure dolor in reprehenderit in voluptate',
  ];

  // === 3. TÍNH TOÁN GIÁ (ĐỘNG) ===
  const { totalPrice, passengerCount } = useMemo(() => {
    const base = (bookingData.outboundFlight?.basePrice || 0) + (bookingData.inboundFlight?.basePrice || 0);
    // (Lưu ý: Nếu basePrice đã là giá khứ hồi, hãy bỏ '+ inboundFlight.basePrice')
    
    const seat = bookingData.selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
    
    // Tính giá hành lý từ state API
    const bagPrice =
      baggageOptions.find((b) => b.optionId === checkedBagId)?.price || 0; // <-- SỬA LỖI: Dùng 'optionId'
      
    const protectionPrice =
      travelProtection === 'with-insurance' ? INSURANCE_PRICE : 0;

    const total = base + seat + bagPrice + protectionPrice;
    const count = bookingData.passengers.length || 1;

    return { totalPrice: total, passengerCount: count };
  }, [bookingData, checkedBagId, travelProtection, baggageOptions]);

  // === 4. HÀM handleNext ===
  const handleNext = () => {
    // Lấy đối tượng hành lý đã chọn từ state API
    const selectedBaggageObject = baggageOptions.find(
      (b) => b.optionId === checkedBagId // <-- SỬA LỖI: Dùng 'optionId'
    );
    
    if (!selectedBaggageObject) {
        Alert.alert("Vui lòng chọn hành lý.");
        return;
    }
    
    setBaggageData(selectedBaggageObject);
    setProtectionData(travelProtection === 'with-insurance');
    navigation.navigate('CheckoutSeatInformation'); // <-- Đi đến màn hình chọn chuyến bay
  };

  const navigateToStep = (step: number) => {
    if (step === 1) navigation.navigate('CheckoutPassengerInformation'); // Quay lại Passenger
    // (Không cho phép nhảy tới bước 3, 4)
  };

  // === 5. XỬ LÝ TRẠNG THÁI LOADING / ERROR ===
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* (Bạn có thể giữ lại Header nếu muốn) */}
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 20, color: 'red' }}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }
  
  // === 6. RENDER (UI) ===
  // (Chúng ta sẽ lọc và hiển thị data API cho khớp với UI Mẫu)
  const personalBag = baggageOptions.find(b => b.type === 'Personal');
  const checkedBag = baggageOptions.find(b => b.type === 'Checked');
  const noCheckedBag = baggageOptions.find(b => b.type === 'No Checked');
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Thanh tiến độ của bạn đã đúng) */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          {/* Progress steps (ĐÃ SỬA LUỒNG) */}
          <View style={styles.stepsRow}>
             {/* 1. Passenger (Completed) */}
             <TouchableOpacity onPress={() => navigateToStep(1)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLineActive} />
            {/* 2. Baggage (Active) */}
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="briefcase" size={20} color="#fff" />
            </View>
            <View style={styles.stepLine} />
            {/* 3. Seat (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(3)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="sofa" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLine} />
            {/* 4. Payment (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(4)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.pageTitle}>Baggage</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* === 7. HIỂN THỊ HÀNH LÝ TỪ API (Khớp UI Mẫu) === */}
        {personalBag && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cabin bags</Text>
            <TouchableOpacity
              key={personalBag.optionId}
              style={styles.optionCard}
            >
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="bag-personal" size={24} color="#6b7280" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{personalBag.weight}</Text>
                  <Text style={styles.optionSubtitle}>Included per traveller</Text>
                </View>
              </View>
              <RadioButton value={personalBag.optionId} status={'checked'} color="#06b6d4" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checked bags</Text>
          {checkedBag && (
            <TouchableOpacity
              key={checkedBag.optionId}
              style={styles.optionCard}
              onPress={() => setCheckedBagId(checkedBag.optionId)}
            >
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="bag-suitcase" size={24} color="#6b7280" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{checkedBag.weight}</Text>
                  <Text style={styles.optionSubtitle}>
                    {`from $${checkedBag.price.toFixed(2)}`}
                  </Text>
                </View>
              </View>
              <RadioButton
                value={checkedBag.optionId}
                status={checkedBagId === checkedBag.optionId ? 'checked' : 'unchecked'}
                onPress={() => setCheckedBagId(checkedBag.optionId)}
                color="#06b6d4"
              />
            </TouchableOpacity>
          )}
          {noCheckedBag && (
            <TouchableOpacity
              key={noCheckedBag.optionId}
              style={styles.optionCard}
              onPress={() => setCheckedBagId(noCheckedBag.optionId)}
            >
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="close-circle-outline" size={24} color="#6b7280" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{noCheckedBag.type}</Text>
                  <Text style={styles.optionSubtitle}>{noCheckedBag.weight}</Text>
                </View>
              </View>
              <RadioButton
                value={noCheckedBag.optionId}
                status={checkedBagId === noCheckedBag.optionId ? 'checked' : 'unchecked'}
                onPress={() => setCheckedBagId(noCheckedBag.optionId)}
                color="#06b6d4"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Travel protection (Giữ nguyên) */}
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Travel protection</Text>

  {/* Lựa chọn "With Insurance" */}
  <TouchableOpacity 
    style={styles.optionCard}
    onPress={() => setTravelProtection("with-insurance")}
  >
    <View style={styles.optionLeftFull}>
      <View style={styles.optionHeader}>
        <MaterialCommunityIcons name="shield-check" size={24} color="#6b7280" />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>1 checked bag (Max weight 22.1 lbs)</Text>
          <Text style={styles.optionSubtitle}>from $19.99</Text>
        </View>
        <RadioButton
          value="with-insurance"
          status={travelProtection === "with-insurance" ? "checked" : "unchecked"}
          onPress={() => setTravelProtection("with-insurance")}
          color="#06b6d4"
        />
      </View>

      {/* Hiển thị chi tiết khi được chọn */}
      {travelProtection === "with-insurance" && (
        <View style={styles.featuresList}>
          {protectionFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <MaterialCommunityIcons name="check" size={20} color="#10b981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </TouchableOpacity>

  {/* Lựa chọn "No Insurance" */}
  <TouchableOpacity 
    style={styles.optionCard}
    onPress={() => setTravelProtection("no-insurance")}
  >
    <View style={styles.optionLeft}>
      <MaterialCommunityIcons name="close-circle-outline" size={24} color="#6b7280" />
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>No insurance</Text>
        <Text style={styles.optionSubtitle}>$00.00</Text>
      </View>
    </View>
    <RadioButton
      value="no-insurance"
      status={travelProtection === "no-insurance" ? "checked" : "unchecked"}
      onPress={() => setTravelProtection("no-insurance")}
      color="#06b6d4"
    />
  </TouchableOpacity>
</View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer (Giữ nguyên) */}
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
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionLeftFull: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  featuresList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
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