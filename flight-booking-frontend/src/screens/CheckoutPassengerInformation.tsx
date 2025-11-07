import { useState, useMemo } from 'react'; // <-- THÊM useMemo
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert, // <-- THÊM Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Menu, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext'; // <-- IMPORT CONTEXT

// (Giữ nguyên các interface của bạn)
interface TravellerFormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  countryCode: string;
  phone: string;
  // Thêm các trường bạn cần (dateOfBirth, nationality...)
}

export default function CheckoutPassengerInformation({ navigation }: any) {
  const theme = useTheme();
  
  // === 1. LẤY DATA TỪ KHO CHỨA ===
  const { bookingData, setPassengerData } = useBooking();

  // === 2. SỬA useState ĐỂ TỰ ĐỘNG ĐIỀN ===
  const [formData, setFormData] = useState<TravellerFormData>(() => {
    // Lấy thông tin hành khách đầu tiên (nếu có) từ context
    const existingPassenger = bookingData.passengers[0];
    if (existingPassenger) {
      return {
        firstName: existingPassenger.firstName || '',
        lastName: existingPassenger.lastName || '',
        gender: existingPassenger.gender || '',
        email: existingPassenger.email || '',
        countryCode: existingPassenger.countryCode || '+07',
        phone: existingPassenger.phone || '',
      };
    }
    // Giá trị mặc định nếu chưa có
    return {
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      countryCode: '+07',
      phone: '',
    };
  });

  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [countryCodeMenuVisible, setCountryCodeMenuVisible] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];
  const countryCodes = ['+07', '+1', '+44', '+91', '+86', '+81'];

  // === 3. TÍNH TOÁN GIÁ (ĐỘNG) ===
  const { totalPrice, passengerCount } = useMemo(() => {
    const base = bookingData.outboundFlight?.basePrice || 0;
    // Giá ghế đã chọn từ màn hình trước
    const seat = bookingData.selectedSeats.reduce(
      (sum, s) => sum + (s.price || 0),
      0
    );
    // (Giá hành lý sẽ được thêm ở bước tiếp theo)
    const total = base + seat; 
    
    // Đếm số hành khách dựa trên số ghế đã chọn
    const count = bookingData.selectedSeats.length || 1; 

    return { totalPrice: total, passengerCount: count };
  }, [bookingData.outboundFlight, bookingData.selectedSeats]);


  const handleInputChange = (field: keyof TravellerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // === 4. SỬA HÀM handleNext ===
  const handleNext = () => {
  // (Thêm code kiểm tra (validate) form của bạn ở đây)
  if (!formData.firstName || !formData.lastName || !formData.email) {
    Alert.alert('Thiếu thông tin', 'Vui lòng điền các trường bắt buộc.');
    return;
  }

  // 1. "Đóng gói" data hành khách
  // (Backend của bạn cần 'fullName', nên chúng ta gộp lại)
  const passengerList = [
    {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
    },
  ];

  // 2. LƯU data vào "kho chứa"
  setPassengerData(passengerList);

  // 3. Chuyển sang màn hình Hành lý (Baggage)
  navigation.navigate('CheckoutBaggageInformation');
};

  // === 5. SỬA HÀM navigateToStep (Sửa luồng) ===
  const navigateToStep = (step: number) => {
    // Luồng mới: 1. Ghế -> 2. Hành khách -> 3. Hành lý -> 4. Thanh toán
    if (step === 1) {
      navigation.navigate('CheckoutSelectSeats'); // Quay lại chọn ghế
    } else if (step === 3) {
      handleNext(); // Lưu data rồi mới đi tiếp
    } else if (step === 4) {
      handleNext(); 
      navigation.navigate('CheckoutPayment');
    }
  };

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

          {/* Progress steps (ĐÃ SỬA LẠI LUỒNG ĐÚNG) */}
          <View style={styles.stepsRow}>
            
            {/* Step 1: Passenger (Active) */}
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="account" size={20} color="#fff" />
            </View>

            <View style={styles.stepLine} />

            {/* Step 2: Baggage (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(2)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons
                  name="briefcase"
                  size={20}
                  color="#9ca3af"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.stepLine} />

            {/* Step 3: Seat (Inactive) */}
            <TouchableOpacity onPress={() => navigateToStep(3)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons
                  name="sofa"
                  size={20}
                  color="#9ca3af"
                />
              </View>
            </TouchableOpacity>

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

        <Text style={styles.pageTitle}>Traveller information</Text>
      </View>

      {/* Main content (Giữ nguyên) */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.travellerCount}>Traveller: {passengerCount} adult</Text>
        
        {/* Form inputs (Giữ nguyên) */}
        <View style={styles.formSection}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            // ... (các props khác giữ nguyên)
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            // ... (các props khác giữ nguyên)
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Gender</Text>
          <Menu
            visible={genderMenuVisible}
            onDismiss={() => setGenderMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setGenderMenuVisible(true)}
              >
                <Text style={formData.gender ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {formData.gender || 'Select option'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>
            }
          >
            {genderOptions.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  handleInputChange('gender', option);
                  setGenderMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Contact details</Text>
        
        <View style={styles.formSection}>
          <Text style={styles.label}>Contact email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            // ... (các props khác giữ nguyên)
          />
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.label}>Contact phone</Text>
          <View style={styles.phoneRow}>
            {/* Country Code Menu (Giữ nguyên) */}
            <Menu
              visible={countryCodeMenuVisible}
              onDismiss={() => setCountryCodeMenuVisible(false)}
              anchor={
                <TouchableOpacity style={styles.countryCodeButton} onPress={() => setCountryCodeMenuVisible(true)}>
                  <Text style={styles.countryCodeText}>{formData.countryCode}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color="#6b7280" />
                </TouchableOpacity>
              }
            >
              {countryCodes.map((code) => (
                <Menu.Item
                  key={code}
                  onPress={() => {
                    handleInputChange('countryCode', code);
                    setCountryCodeMenuVisible(false);
                  }}
                  title={code}
                />
              ))}
            </Menu>
            {/* Phone Input (Giữ nguyên) */}
            <TextInput
              style={styles.phoneInput}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              // ... (các props khác giữ nguyên)
            />
          </View>
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
          onPress={handleNext} // <-- Dùng hàm handleNext đã sửa
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

// ... (Toàn bộ 'styles' của bạn giữ nguyên, không cần sửa)
const styles = StyleSheet.create({
// ... Dán toàn bộ styles của bạn vào đây ...
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
  stepCompleted: { // <-- Thêm style này (nếu chưa có)
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
  stepLineActive: { // <-- Thêm style này (nếu chưa có)
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
  travellerCount: { 
    fontSize: 19, 
    color: "#6b7280",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 19,
    fontWeight: "700",
    color: "#535863ff",
    marginBottom: 8,
  },
  input: { 
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#111827",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  dropdownTextPlaceholder: { 
    color: "#d1d5db", 
    fontSize: 15,
  },
  dropdownTextSelected: { 
    color: "#111827", 
    fontSize: 15,
  },
  divider: { 
    height: 1, 
    backgroundColor: "#f3f4f6",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#6b7280",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  phoneRow: { 
    flexDirection: "row", 
    gap: 10,
  },
  countryCodeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minWidth: 90,
    backgroundColor: "#fff",
  },
  countryCodeText: { 
    fontSize: 15, 
    color: "#111827",
    fontWeight: "500",
  },
  phoneInput: { 
    flex: 1, 
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#111827",
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