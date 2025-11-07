import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBooking } from '../context/BookingContext'; // <-- THÊM MỚI
import { BackendFlight } from '../services/flightService'; // <-- THÊM MỚI

// (Các interface và data AIRPORTS cũ của bạn giữ nguyên)
type TripType = 'round-trip' | 'one-way' | 'multi-city';
type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';
interface Flight { from: string; to: string; date: string; }
interface Airport { name: string; code: string; city: string; country: string; }
const AIRPORTS: Airport[] = [
  { name: 'London City Airport', code: 'LCY', city: 'London', country: 'United Kingdom' },
  { name: 'Heathrow Airport', code: 'LHR', city: 'London', country: 'United Kingdom' },
  { name: 'John F. Kennedy International', code: 'JFK', city: 'New York', country: 'USA' },
  { name: 'LaGuardia Airport', code: 'LGA', city: 'New York', country: 'USA' },
  { name: 'Newark Liberty International', code: 'EWR', city: 'New York', country: 'USA' },
];


const FlightSearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { setFlightData, clearBookingData } = useBooking(); // <-- THÊM MỚI: Lấy hàm từ "kho"

  // (Toàn bộ useState và useEffect cũ của bạn giữ nguyên)
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('Fri, Jul 14');
  const [returnDate, setReturnDate] = useState('Fri, Jul 17');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');
  const [flights, setFlights] = useState<Flight[]>([
    { from: '', to: '', date: 'Fri, Jul 14' },
    { from: '', to: '', date: 'Fri, Jul 14' },
  ]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectingDepartDate, setIsSelectingDepartDate] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [selectedReturnDay, setSelectedReturnDay] = useState<number>(17);
  const totalTravellers = adults + children + infants;
  React.useEffect(() => {
    // ... (useEffect cũ của bạn giữ nguyên)
  }, [navigation]);

  // (Toàn bộ các hàm xử lý cũ của bạn: addFlight, swapLocations, selectAirport, getDayName, handleDaySelect, filteredAirports... giữ nguyên)
  // ...
  // ... (Tất cả các hàm renderModal cũ của bạn... giữ nguyên)
  // ...
  
  // === HÀM MỚI ĐỂ TEST LUỒNG CỦA BẠN ===
 const handleTestBookingFlow = () => {
    clearBookingData();

    // 1. TẠO CHUYẾN BAY ĐI (Outbound)
    const mockOutboundFlight: BackendFlight = {
      flightId: 'FL001',
      flightCode: 'LCYJFK',
      departureAirport: 'London City',
      arrivalAirport: 'John F Kennedy',
      departureTime: '2025-07-14 06:30:00',
      arrivalTime: '2025-07-14 14:00:00',
      airline: 'SkyHaven',
      basePrice: 806.00,
      stopCount: 0,
      duration: 450,
    };
    
    // 2. TẠO CHUYẾN BAY VỀ (Inbound) - Dùng data từ SQL
    const mockInboundFlight: BackendFlight = {
      flightId: 'FL002',
      flightCode: 'JFKLCY',
      departureAirport: 'John F Kennedy',
      arrivalAirport: 'London City',
      departureTime: '2025-07-17 10:00:00',
      arrivalTime: '2025-07-17 22:15:00',
      airline: 'EcoWings',
      basePrice: 806.00, // (Lưu ý: Backend của bạn đang để giá 2 chiều,
                         // nên giá vé 1 chiều có thể là 403.00)
      stopCount: 0,
      duration: 435,
    };

    // 3. "BƠM" CẢ 2 CHUYẾN BAY VÀO KHO CHỨA
    setFlightData(mockOutboundFlight, mockInboundFlight); 

    // 4. ĐIỀU HƯỚNG TỚI MÀN HÌNH ĐẦU TIÊN CỦA LUỒNG
    navigation.navigate('CheckoutPassengerInformation'); 
  };
  
  // (Tất cả các hàm renderModal cũ của bạn)
  const renderOptionsModal = () => (
    <Modal visible={showOptionsModal}>{/*... (code cũ) ...*/}</Modal>
  );
  const renderDateModal = () => (
    <Modal visible={showDateModal}>{/*... (code cũ) ...*/}</Modal>
  );
  const renderLocationModal = (isFrom: boolean) => (
    <Modal visible={isFrom ? showFromModal : showToModal}>{/*... (code cũ) ...*/}</Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header (Giữ nguyên) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Trip Type Tabs (Giữ nguyên) */}
      <View style={styles.tabContainer}>{/*... (code cũ) ...*/}</View>

      {/* ScrollView (Giữ nguyên) */}
      <ScrollView style={styles.content}>{/*... (code cũ) ...*/}</ScrollView>

      {/* Footer (ĐÃ THÊM NÚT TEST) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            // ... (Code nút Search cũ của bạn giữ nguyên)
            const params = {
              from: from || 'London',
              to: to || 'New York',
              departDate: departDate,
              returnDate: tripType === 'round-trip' ? returnDate : undefined,
              travellers: totalTravellers,
              cabinClass: cabinClass,
            };
            // @ts-ignore
            navigation.navigate('FlightBookingSearchResults', params);
          }}
        >
          <Text style={styles.searchButtonText}>Search flights</Text>
        </TouchableOpacity>
        
        {/* === NÚT TEST MỚI CỦA BẠN === */}
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: '#c00', marginTop: 10 }]}
          onPress={handleTestBookingFlow}
        >
          <Text style={styles.searchButtonText}>
            (TEST) Bắt đầu Đặt vé FL001
          </Text>
        </TouchableOpacity>
        {/* ============================== */}

      </View>

      {/* Modals (Giữ nguyên) */}
      {renderOptionsModal()}
      {renderDateModal()}
      {renderLocationModal(true)}
      {renderLocationModal(false)}
    </View>
  );
};

// ... (Toàn bộ styles cũ của bạn giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#333',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  flightSection: {
    marginBottom: 20,
  },
  flightLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationInputsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  inputPlaceholder: {
    fontSize: 16,
    color: '#999',
    marginLeft: 12,
  },
  inputValue: {
    color: '#333',
    fontWeight: '500',
  },
  swapButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  dateRow: {
    flexDirection: 'row',
  },
  addFlightButton: {
    borderWidth: 1,
    borderColor: '#00BCD4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  addFlightText: {
    fontSize: 16,
    color: '#00BCD4',
    fontWeight: '600',
  },
  travellerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  travellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  travellerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  searchButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  counterLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  counterSubLabel: {
    fontSize: 14,
    color: '#999',
 },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  classOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  classOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
   justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
  },
  tripTypeLabel: {
    fontSize: 14,
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
 },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  dateItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  dateItemActive: {
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  dateTextActive: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  calendar: {
    paddingHorizontal: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weekDay: {
    fontSize: 14,
    color: '#999',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
   justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#00BCD4',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledDayText: {
    color: '#ccc',
  },
  locationInputs: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
   marginVertical: 16,
    borderRadius: 12,
    padding: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  locationResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
  airportItem: {
    flexDirection: 'row',
     alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  airportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  airportName: {
    fontSize: 16,
   color: '#333',
    marginBottom: 4,
  },
  airportDistance: {
    fontSize: 14,
    color: '#999',
  },
  airportCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default FlightSearchScreen;