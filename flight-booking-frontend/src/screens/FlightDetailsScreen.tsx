import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, Surface, Divider } from 'react-native-paper';
import { Flight, Itinerary } from '../types/flight'; // Import kiểu dữ liệu thật
import { useBooking } from '../context/BookingContext'; // <-- BƯỚC 1: IMPORT BOOKING CONTEXT

// =================================================================
// ĐỊNH NGHĨA TYPES (Cho route params)
// =================================================================
interface FlightDetailsScreenProps {
  navigation: any;
  route: any;
}

// =================================================================
// COMPONENT CHÍNH
// =================================================================
const FlightDetailsScreen: React.FC<FlightDetailsScreenProps> = ({ navigation, route }) => {
  // State cho giao diện
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreOutbound, setShowMoreOutbound] = useState(false);
  const [showMoreInbound, setShowMoreInbound] = useState(false);

  // Lấy hàm set data từ Context
  const { setBookingData } = useBooking(); // <-- BƯỚC 2: LẤY HÀM SETTER

  // LẤY DỮ LIỆU THẬT TỪ ROUTE PARAMS
  const { outboundFlight, returnFlight, searchCriteria, passengers } = route.params || {};

  // (Các hàm helper formatTime, formatDate, formatDuration giữ nguyên)
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  const formatDuration = (minutes: number) => {
    if (!minutes) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Dữ liệu giả lập (Giữ nguyên)
  const mockAmenities = {
    seatPitch: '28" seat pitch',
    meal: 'Light meal',
    wifi: 'Chance of WiFi',
    power: 'No power outlet',
    entertainment: 'No entertainment',
  };
  const mockBaggage = {
    included: { type: 'personal item', note: 'Must go under the seat in front of you' },
    extra: [
      { type: 'Carry-on', price: 11.99, status: 'Available in the next steps' },
      { type: 'Checked bag', price: 19.99, status: 'Available in the next steps' },
    ]
  };

  // BƯỚC 3: SỬA LẠI HÀM HANDLESELECT
  const handleSelect = () => {
    console.log("Saving itinerary to context:", outboundFlight.flightId);
    
    // TÍNH TỔNG GIÁ VÉ GỐC
    const totalPrice = outboundFlight.basePrice + (returnFlight?.basePrice || 0);

    // LƯU DỮ LIỆU VÀO KHO CHỨA (CONTEXT)
    // (Giả sử setBookingData nhận một phần của state)
    setBookingData({ 
        outboundFlight: outboundFlight,
        inboundFlight: returnFlight,
        searchCriteria: searchCriteria,
        passengersData: passengers, // Lưu trữ thông tin số lượng
        totalPrice: totalPrice, // Lưu giá gốc
        
        // Reset các bước sau
        selectedSeats: [], 
        selectedBaggage: [], 
     });

    // Chuyển sang màn hình Passenger
    navigation.navigate("CheckoutPassengerInformation");
  };

  const handleShare = () => {
    console.log('Share flight');
  };

  // KIỂM TRA NẾU KHÔNG CÓ DỮ LIỆU (Giữ nguyên)
  if (!outboundFlight || !searchCriteria || !passengers) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={1}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 48 }} />
        </Surface>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
          <Text style={{marginTop: 10, color: '#6b7280'}}>Loading flight data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Lấy dữ liệu đã format để hiển thị (Giữ nguyên)
  const from = searchCriteria.from;
  const to = searchCriteria.to;
  const dateRange = `${searchCriteria.departDate}${returnFlight ? ' - ' + searchCriteria.returnDate : ''}`;
  const totalTravellers = passengers.adults + passengers.children + passengers.infants;
  const cabinClass = searchCriteria.cabinClass;
  const tripType = searchCriteria.tripType;
  const totalPrice = outboundFlight.basePrice + (returnFlight?.basePrice || 0);

  // ... (Toàn bộ JSX của bạn từ dòng 223 đến 306 giữ nguyên) ...
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Flight details</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            iconColor={isFavorite ? '#ef4444' : '#000'}
            onPress={() => setIsFavorite(!isFavorite)}
          />
          <IconButton icon="share-variant-outline" size={24} onPress={handleShare} />
        </View>
      </Surface>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Header */}
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>Your trip to {to}</Text>
          <Text style={styles.tripSubtitle}>from {from}</Text>
        </View>

        {/* Date Badge */}
        <Surface style={styles.dateBadge} elevation={0}>
          <Text style={styles.dateBadgeText}>{dateRange}</Text>
        </Surface>

        {/* Trip Info */}
        <View style={styles.tripInfoRow}>
  <View style={styles.tripInfoItemInline}>
    <Ionicons name="person-outline" size={14} color="#6b7280" />
    <Text style={styles.tripInfoTextInline}>
      {totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}
    </Text>
  </View>

  <Text style={styles.dotSeparator}>·</Text>

  <View style={styles.tripInfoItemInline}>
    <Ionicons name="airplane-outline" size={14} color="#6b7280" />
    <Text style={styles.tripInfoTextInline}>{cabinClass}</Text>
  </View>

  <Text style={styles.dotSeparator}>·</Text>

  <View style={styles.tripInfoItemInline}>
    <Ionicons name="ticket-outline" size={14} color="#6b7280" />
    <Text style={styles.tripInfoTextInline}>{tripType}</Text>
  </View>
</View>
        {/* Outbound Flight Card (Dùng component con) */}
        <FlightCard
          flight={outboundFlight}
          amenities={mockAmenities} // Dùng data giả
          showMore={showMoreOutbound}
          onToggleMore={() => setShowMoreOutbound(!showMoreOutbound)}
        />

        {/* Inbound Flight Card (Dùng component con) */}
        {returnFlight && (
          <FlightCard
            flight={returnFlight}
            amenities={mockAmenities} // Dùng data giả
            showMore={showMoreInbound}
            onToggleMore={() => setShowMoreInbound(!showMoreInbound)}
            style={styles.cardSpacing}
          />
        )}

        {/* Baggage Section (Dùng component con) */}
        <BaggageSection baggage={mockBaggage} />

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Price Bar */}
      <Surface style={styles.bottomBar} elevation={4}>
        <View>
          <Text style={styles.priceAmount}>${totalPrice.toFixed(2)}</Text>
          <Text style={styles.priceLabel}>Total price</Text>
        </View>
        <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </Surface>
    </SafeAreaView>
  );
};

// ... (Toàn bộ component con: FlightCard, AmenityItem, BaggageSection giữ nguyên) ...
// (Lưu ý: Bỏ gạch ngang và sửa khoảng cách icon)
// =================================================================
// COMPONENT CON: FLIGHT CARD
// =================================================================
interface FlightCardProps {
  flight: Flight; // Dùng kiểu 'Flight' thật
  amenities: any; // Kiểu cho tiện nghi (giả lập)
  showMore: boolean;
  onToggleMore: () => void;
  style?: any;
}
const formatTimeCard = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};
const formatDateCard = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
const formatDurationCard = (minutes: number) => {
    if (!minutes) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};
const FlightCard: React.FC<FlightCardProps> = ({ flight, amenities, showMore, onToggleMore, style }) => {
  const isDirect = flight.stopCount === 0;
  return (
    <Surface style={[styles.card, style]} elevation={1}>
      <View style={styles.routeHeader}>
        <View>
          <Text style={styles.routeText}>
            {flight.departureAirport} - {flight.arrivalAirport}
          </Text>
        </View>
        <View style={styles.airlineInfo}>
          <Text style={styles.airlineText}>{flight.airline}</Text>
          <Text style={styles.airlineText}>{flight.flightCode}</Text>
        </View>
      </View>
      <View style={styles.flightTimes}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTimeCard(flight.departureTime)}</Text>
          <Text style={styles.dateText}>{formatDateCard(flight.departureTime)}</Text>
        </View>
        <View style={styles.flightDuration}>
          <Text style={styles.durationStops}>
            {isDirect ? 'Direct' : `${flight.stopCount} stop${flight.stopCount > 1 ? 's' : ''}`}
          </Text>
          <View style={styles.flightLine}>
            <View style={styles.line} />
            <Ionicons name="airplane" size={16} color="#9ca3af" style={styles.planeIcon} />
          </View>
          <Text style={styles.durationText}>{formatDurationCard(flight.duration)}</Text>
        </View>
        <View style={[styles.timeBlock, styles.timeBlockRight]}>
          <Text style={styles.time}>{formatTimeCard(flight.arrivalTime)}</Text>
          <Text style={styles.dateText}>{formatDateCard(flight.arrivalTime)}</Text>
        </View>
      </View>
      {showMore && amenities && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.amenitiesGrid}>
            <AmenityItem icon="resize-outline" text={amenities.seatPitch} />
            <AmenityItem icon="restaurant-outline" text={amenities.meal} />
            <AmenityItem icon="wifi-outline" text={amenities.wifi} />
            <AmenityItem icon="flash-outline" text={amenities.power} />
            <AmenityItem icon="tv-outline" text={amenities.entertainment} />
          </View>
        </>
      )}
      <TouchableOpacity style={styles.moreButton} onPress={onToggleMore}>
        <Text style={styles.moreButtonText}>
          {showMore ? 'Less info' : 'More info'}
        </Text>
      </TouchableOpacity>
    </Surface>
  );
};
// =================================================================
// COMPONENT CON: AMENITY ITEM
// =================================================================
interface AmenityItemProps {
  icon: any;
  text: string;
}
const AmenityItem: React.FC<AmenityItemProps> = ({ icon, text }) => {
  const isAvailable = !(text.toLowerCase().startsWith('no ') || text.toLowerCase().startsWith('chance of'));
  return (
    <View style={styles.amenityItem}>
      <Ionicons name={icon} size={16} color={isAvailable ? "#10b981" : "#9ca3af"} />
      <Text style={[styles.amenityText, !isAvailable && styles.amenityTextUnavailable]}>
        {text}
      </Text>
    </View>
  );
};
// =================================================================
// COMPONENT CON: BAGGAGE SECTION
// =================================================================
interface BaggageSectionProps {
  baggage: any; 
}
const BaggageSection: React.FC<BaggageSectionProps> = ({ baggage }) => (
  <View style={styles.baggageSection}>
    <Text style={styles.sectionTitle}>Included baggage</Text>
    <Text style={styles.sectionSubtitle}>
      The total baggage included in the price
    </Text>
    <Surface style={styles.card} elevation={1}>
      <View style={styles.baggageItem}>
        <Ionicons name="briefcase-outline" size={24} color="#6b7280" />
        <View style={styles.baggageContent}>
          <Text style={styles.baggageType}>1 {baggage.included.type}</Text>
          <Text style={styles.baggageNote}>{baggage.included.note}</Text>
          <Text style={styles.includedText}>Included</Text>
        </View>
      </View>
      <View style={styles.baggageLinks}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Baggage policies</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>  |  </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Airline info</Text>
        </TouchableOpacity>
      </View>
    </Surface>
    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Extra baggage</Text>
    {baggage.extra.map((item: any, index: number) => (
      <View key={index} style={styles.extraBaggageItem}>
        <Ionicons name={item.type === 'Carry-on' ? 'hand-left-outline' : 'briefcase-outline'} size={24} color="#6b7280" />
        <View style={styles.extraBaggageContent}>
          <Text style={styles.baggageType}>{item.type}</Text>
          <Text style={styles.baggagePrice}>From ${item.price.toFixed(2)}</Text>
          <Text style={styles.baggageStatus}>{item.status}</Text>
        </View>
      </View>
    ))}
  </View>
);

// =================================================================
// STYLES (Đã sửa lỗi gạch ngang và khoảng cách)
// =================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tripHeader: {
    marginBottom: 24,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tripSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tripInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: 24,
},

tripInfoItemInline: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4, // icon sát chữ
},

tripInfoTextInline: {
  fontSize: 14,
  color: '#6b7280',
},

dotSeparator: {
  fontSize: 16,
  color: '#6b7280',
  marginHorizontal: 8,
  marginTop: -2,
},

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  cardSpacing: {
    marginTop: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  airlineInfo: {
    alignItems: 'flex-end',
  },
  airlineText: {
    fontSize: 12,
    color: '#6b7280',
  },
  flightTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  flightDuration: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  durationStops: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  flightLine: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#d1d5db',
  },
  planeIcon: {
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '48%',
  },
  amenityText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  amenityTextUnavailable: {
    // textDecorationLine: 'line-through', // <-- ĐÃ XÓA GẠCH NGANG
    color: '#9ca3af',
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  baggageSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  baggageItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  baggageContent: {
    flex: 1,
  },
  baggageType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  baggageNote: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  includedText: {
    fontSize: 14,
    color: '#ea580c',
    fontWeight: '600',
    marginTop: 8,
  },
  baggageLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#06b6d4',
  },
  separator: {
    fontSize: 12,
    color: '#d1d5db',
  },
  extraBaggageItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  extraBaggageContent: {
    flex: 1,
  },
  baggagePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  baggageStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '700',
   color: '#111827',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FlightDetailsScreen;