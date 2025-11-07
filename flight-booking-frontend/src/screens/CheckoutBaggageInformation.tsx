import { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext';

// Định nghĩa một loại hành lý
interface BaggageOption {
  id: string;
  type: string;
  weight: string;
  price: number;
}

// Data hành lý mẫu
const CHECKED_BAG_OPTIONS = {
  '1-checked': {
    id: '1-checked',
    type: 'Checked',
    weight: '22 lbs',
    price: 19.99,
  },
  'no-checked': {
    id: 'no-checked',
    type: 'No Checked',
    weight: '0 lbs',
    price: 0.0,
  },
};

// === 1. SỬA LỖI (any): ĐỊNH NGHĨA TYPE CHO KEY ===
type CheckedBagId = keyof typeof CHECKED_BAG_OPTIONS;

const INSURANCE_PRICE = 19.99;

export default function CheckoutBaggageInformation({ navigation }: any) {
  // === 2. LẤY DATA & HÀM MỚI TỪ KHO CHỨA ===
  const { bookingData, setBaggageData, setProtectionData } = useBooking();

  const [cabinBag, setCabinBag] = useState('personal');

  // === 3. SỬA LỖI (any): DÙNG TYPE MỚI ===
  const getInitialBag = (): CheckedBagId => {
    const savedId = bookingData.baggage?.id;
    if (savedId === '1-checked' || savedId === 'no-checked') {
      return savedId;
    }
    return '1-checked'; // Mặc định
  };
  const [checkedBag, setCheckedBag] = useState<CheckedBagId>(getInitialBag);

  // === 4. SỬA LỖI (protection): LỖI NÀY ĐÃ TỰ HẾT ===
  const [travelProtection, setTravelProtection] = useState(
    () => (bookingData.protection ? 'with-insurance' : 'no-insurance')
  );

  const protectionFeatures = [
    'Laboris exercitation Lorem anim pariatur',
    'Duis aute irure dolor in reprehenderit in voluptate',
  ];

  // === 5. TÍNH TOÁN GIÁ (ĐỘNG) ===
  const { totalPrice, passengerCount } = useMemo(() => {
    const base = bookingData.outboundFlight?.basePrice || 0;
    const seat = bookingData.selectedSeats.reduce(
      (sum, s) => sum + (s.price || 0),
      0
    );
    // Dùng 'checkedBag' (type-safe) để lấy giá
    const bagPrice = CHECKED_BAG_OPTIONS[checkedBag].price; // <-- LỖI (any) ĐÃ FIX
    const protectionPrice =
      travelProtection === 'with-insurance' ? INSURANCE_PRICE : 0;

    const total = base + seat + bagPrice + protectionPrice;
    const count = bookingData.passengers.length || 1;

    return { totalPrice: total, passengerCount: count };
  }, [bookingData, checkedBag, travelProtection]);

  // === 6. SỬA HÀM handleNext ===
  const handleNext = () => {
  // 1. Lấy đối tượng hành lý đã chọn
  const selectedBaggageObject = CHECKED_BAG_OPTIONS[checkedBag];

  // 2. LƯU data vào "kho chứa"
  setBaggageData(selectedBaggageObject);

  // (Bạn cũng có thể lưu data bảo hiểm 'travelProtection' vào context nếu cần)

  // 3. Chuyển sang màn hình Chọn Ghế
  navigation.navigate('CheckoutSeatInformation'); // (Đây là tên file đúng từ thư mục của bạn)
};

  // ... (Hàm 'navigateToStep' và toàn bộ code RENDER (UI) của bạn
  //      không cần thay đổi, hãy giữ nguyên) ...
  // ...
  // === (DÁN TOÀN BỘ PHẦN RENDER VÀ STYLES CỦA BẠN VÀO ĐÂY) ===
  // ...
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and steps */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.stepsRow}>
            {/* Step 1: Seat (Completed) */}
            <TouchableOpacity onPress={() => navigateToStep(1)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="sofa" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLineActive} />
            {/* Step 2: Passenger (Completed) */}
            <TouchableOpacity onPress={() => navigateToStep(2)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.stepLineActive} />
            {/* Step 3: Baggage (Active) */}
            <View style={styles.stepActive}>
              <MaterialCommunityIcons
                name="briefcase"
                size={20}
                color="#fff"
              />
            </View>
            <View style={styles.stepLine} />
            {/* Step 4: Payment (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(4)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={20}
                  color="#9ca3af"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.pageTitle}>Baggage</Text>
      </View>

      {/* Main content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cabin bags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cabin bags</Text>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setCabinBag('personal')}
          >
            {/* ... (Nội dung Cabin bags) ... */}
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bag-personal" size={24} color="#6b7280" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Personal item only</Text>
                <Text style={styles.optionSubtitle}>Included per traveller</Text>
              </View>
            </View>
            <RadioButton
              value="personal"
              status={cabinBag === "personal" ? "checked" : "unchecked"}
              onPress={() => setCabinBag("personal")}
              color="#06b6d4"
            />
          </TouchableOpacity>
        </View>

        {/* Checked bags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checked bags</Text>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setCheckedBag('1-checked')}
          >
            {/* ... (Nội dung 1-checked) ... */}
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bag-suitcase" size={24} color="#6b7280" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>1 checked bag (Max weight 22.1 lbs)</Text>
                <Text style={styles.optionSubtitle}>from $19.99</Text>
              </View>
            </View>
            <RadioButton
              value="1-checked"
              status={checkedBag === "1-checked" ? "checked" : "unchecked"}
              onPress={() => setCheckedBag("1-checked")}
              color="#06b6d4"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setCheckedBag('no-checked')}
          >
            {/* ... (Nội dung no-checked) ... */}
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="close-circle-outline" size={24} color="#6b7280" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>No checked bag</Text>
                <Text style={styles.optionSubtitle}>$00.00</Text>
              </View>
            </View>
            <RadioButton
              value="no-checked"
              status={checkedBag === "no-checked" ? "checked" : "unchecked"}
              onPress={() => setCheckedBag("no-checked")}
              color="#06b6d4"
            />
          </TouchableOpacity>
        </View>

        {/* Travel protection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel protection</Text>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setTravelProtection('with-insurance')}
          >
            {/* ... (Nội dung with-insurance) ... */}
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
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setTravelProtection('no-insurance')}
          >
            {/* ... (Nội dung no-insurance) ... */}
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

      {/* Footer (Đã sửa lại giá) */}
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

// ... (Dán toàn bộ styles của bạn vào đây)
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