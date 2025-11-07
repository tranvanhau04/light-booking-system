import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, Surface, Divider } from 'react-native-paper';
import { FlightDetails, Flight } from '../services/flightService';

interface FlightDetailsScreenProps {
  navigation: any;
  route: any;
}

const FlightDetailsScreen: React.FC<FlightDetailsScreenProps> = ({ navigation, route }) => {
  const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreOutbound, setShowMoreOutbound] = useState(false);
  const [showMoreInbound, setShowMoreInbound] = useState(false);

  const flightId = route?.params?.flightId;
  const searchParams = route?.params?.searchParams || {
    from: 'London (LCY)',
    to: 'New York (JFK)',
    departDate: 'Fri, Jul 14',
    returnDate: 'Fri, Jul 17',
    travellers: 1,
    cabinClass: 'Economy',
  };
  const options = route?.params?.options || {
    travellers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'Economy'
  };

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightId) return;

      try {
        const res = await axios.get(`http://localhost:8080/api/flights/${flightId}`);
        if (res.data?.success) {
          setFlightDetails(res.data.data); // backend trả về { data: {...} }
        } else {
          console.warn('Không tìm thấy dữ liệu chuyến bay');
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết chuyến bay:', error);
      }
    };

    fetchFlightDetails();
  }, [flightId]);


  const handleSelect = () => {
    if (flightDetails) {
      console.log("Selected flight:", flightDetails.id)
      navigation.navigate("CheckoutPassengerInformation", {
        flightId: flightDetails.id,
        flightDetails: flightDetails,
        searchParams: searchParams,
          options
      })
    }
  }

  const handleShare = () => {
    console.log('Share flight');
  };

  if (!flightDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={1}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 48 }} />
        </Surface>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.headerTitle}>Flight details</Text>

        <View style={styles.headerActions}>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            iconColor={isFavorite ? '#ef4444' : '#000'}
            onPress={() => setIsFavorite(!isFavorite)}
          />
          <IconButton
            icon="share-variant-outline"
            size={24}
            onPress={handleShare}
          />
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
          <Text style={styles.tripTitle}>
            Your trip to {flightDetails.destination}
          </Text>
          <Text style={styles.tripSubtitle}>from {flightDetails.origin}</Text>
        </View>

        {/* Date Badge */}
        <Surface style={styles.dateBadge} elevation={0}>
          <Text style={styles.dateBadgeText}>{flightDetails.dateRange}</Text>
        </Surface>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.tripInfoItem}>
            <Ionicons name="person-outline" size={16} color="#6b7280" />
            <Text style={styles.tripInfoText}>
              {options.travellers.adults + options.travellers.children + options.travellers.infants} travellers
            </Text>
          </View>
          <View style={styles.tripInfoItem}>
            <Ionicons name="airplane-outline" size={16} color="#6b7280" />
            <Text style={styles.tripInfoText}>{options.cabinClass}</Text>
          </View>
          <View style={styles.tripInfoItem}>
            <Ionicons name="ticket-outline" size={16} color="#6b7280" />
            <Text style={styles.tripInfoText}>{searchParams.tripType}</Text>
          </View>
        </View>

        {/* Outbound Flight Card */}
        <FlightCard
          flight={flightDetails.outbound}
          showMore={showMoreOutbound}
          onToggleMore={() => setShowMoreOutbound(!showMoreOutbound)}
        />

        {/* Inbound Flight Card */}
        {flightDetails.inbound && (
          <FlightCard
            flight={flightDetails.inbound}
            showMore={showMoreInbound}
            onToggleMore={() => setShowMoreInbound(!showMoreInbound)}
            style={styles.cardSpacing}
          />
        )}

        {/* Baggage Section */}
        <BaggageSection baggage={flightDetails.baggage} />

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Price Bar */}
      <Surface style={styles.bottomBar} elevation={4}>
        <View>
          <Text style={styles.priceAmount}>${flightDetails.totalPrice}</Text>
          <Text style={styles.priceLabel}>Total price</Text>
        </View>
        <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </Surface>
    </SafeAreaView>
  );
};

// Flight Card Component
interface FlightCardProps {
  flight: Flight;
  showMore: boolean;
  onToggleMore: () => void;
  style?: any;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, showMore, onToggleMore, style }) => {
  const isDirect = flight.stops === 0;

  return (
    <Surface style={[styles.card, style]} elevation={1}>
      {/* Route Header */}
      <View style={styles.routeHeader}>
        <View>
          <Text style={styles.routeText}>
            {flight.departureCity} - {flight.arrivalCity}
          </Text>
        </View>
        <View style={styles.airlineInfo}>
          <Text style={styles.airlineText}>{flight.airline}</Text>
          <Text style={styles.airlineText}>{flight.flightNumber}</Text>
        </View>
      </View>

      {/* Flight Times */}
      <View style={styles.flightTimes}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{flight.departureTime}</Text>
          <Text style={styles.dateText}>{flight.date || flight.departureDate}</Text>
        </View>

        <View style={styles.flightDuration}>
          <Text style={styles.durationStops}>
            {isDirect ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </Text>
          <View style={styles.flightLine}>
            <View style={styles.line} />
            <Ionicons name="airplane" size={16} color="#9ca3af" style={styles.planeIcon} />
          </View>
          <Text style={styles.durationText}>{flight.duration}</Text>
        </View>

        <View style={[styles.timeBlock, styles.timeBlockRight]}>
          <Text style={styles.time}>{flight.arrivalTime}</Text>
          <Text style={styles.dateText}>{flight.arrivalDate || flight.date}</Text>
        </View>
      </View>

      {/* Amenities */}
      {flight.amenities && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.amenitiesGrid}>
            <AmenityItem icon="resize-outline" text={flight.amenities.seatPitch} />
            <AmenityItem icon="restaurant-outline" text={flight.amenities.meal} />
            <AmenityItem icon="wifi-outline" text={flight.amenities.wifi} />
            <AmenityItem icon="flash-outline" text={flight.amenities.power} />
            <AmenityItem icon="tv-outline" text={flight.amenities.entertainment} />
          </View>

          <TouchableOpacity style={styles.moreButton} onPress={onToggleMore}>
            <Text style={styles.moreButtonText}>
              {showMore ? 'Less info' : 'More info'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Surface>
  );
};

// Amenity Item Component
interface AmenityItemProps {
  icon: any;
  text: string;
}

const AmenityItem: React.FC<AmenityItemProps> = ({ icon, text }) => (
  <View style={styles.amenityItem}>
    <Ionicons name={icon} size={16} color="#9ca3af" />
    <Text style={styles.amenityText}>{text}</Text>
  </View>
);

// Baggage Section Component
interface BaggageSectionProps {
  baggage: any;
}

const BaggageSection: React.FC<BaggageSectionProps> = ({ baggage }) => (
  <View style={styles.baggageSection}>
    <Text style={styles.sectionTitle}>Included baggage</Text>
    <Text style={styles.sectionSubtitle}>
      The total baggage included in the price
    </Text>

    {/* Included */}
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
        <Text style={styles.separator}>  |  </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Airline info</Text>
        </TouchableOpacity>
      </View>
    </Surface>

    {/* Extra Baggage */}
    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Extra baggage</Text>
    {baggage.extra.map((item: any, index: number) => (
      <View key={index} style={styles.extraBaggageItem}>
        <Ionicons name="briefcase-outline" size={24} color="#6b7280" />
        <View style={styles.extraBaggageContent}>
          <Text style={styles.baggageType}>{item.type}</Text>
          <Text style={styles.baggagePrice}>From ${item.price.toFixed(2)}</Text>
          <Text style={styles.baggageStatus}>{item.status}</Text>
        </View>
      </View>
    ))}
  </View>
);

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
  tripInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripInfoText: {
    fontSize: 14,
    color: '#6b7280',
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