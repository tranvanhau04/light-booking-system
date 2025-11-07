import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

interface FlightData {
  flightId: string;
  flightCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  tripType: string;
  airline: string;
  basePrice: number;
  stopCount: number;
  availableSeats: number;
  pricePerSeat: number;
}

interface FlightSearchResultsProps {
  navigation?: any;
  route?: any;
}

const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({ navigation, route }) => {
  const [outboundFlights, setOutboundFlights] = useState<FlightData[]>([]);
  const [returnFlights, setReturnFlights] = useState<FlightData[]>([]);
  const [filteredOutbound, setFilteredOutbound] = useState<FlightData[]>([]);
  const [filteredReturn, setFilteredReturn] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Best');
  const [selectedStops, setSelectedStops] = useState('Any stops');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [allAirlines, setAllAirlines] = useState<string[]>([]);

  // Lấy params từ navigation
  const {
    outboundFlights: paramOutbound,
    returnFlights: paramReturn,
    searchCriteria,
    from,
    to,
    departDate,
    returnDate,
    tripType,
    passengers,
    cabinClass
  } = route?.params || {};

  useEffect(() => {
    console.log('📦 Received route params:', route?.params);
    
    if (paramOutbound && paramReturn !== undefined) {
      // Nếu đã có data từ navigation params (từ màn hình search)
      setOutboundFlights(paramOutbound);
      setReturnFlights(paramReturn);
      setFilteredOutbound(paramOutbound);
      setFilteredReturn(paramReturn);

      // Lấy danh sách airlines duy nhất
      const allFlights = [...paramOutbound, ...paramReturn];
      const airlines = [...new Set(allFlights.map(f => f.airline))];
      setAllAirlines(airlines);
      setSelectedAirlines(airlines);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [paramOutbound, paramReturn]);

  useEffect(() => {
    // Apply filters và sort
    applyFiltersAndSort();
  }, [outboundFlights, returnFlights, selectedStops, selectedAirlines, selectedSort]);

  const applyFiltersAndSort = () => {
    let filteredOut = [...outboundFlights];
    let filteredRet = [...returnFlights];

    // Filter by stops
    if (selectedStops === '1 stop or nonstop') {
      filteredOut = filteredOut.filter(f => f.stopCount <= 1);
      filteredRet = filteredRet.filter(f => f.stopCount <= 1);
    } else if (selectedStops === 'Nonstop only') {
      filteredOut = filteredOut.filter(f => f.stopCount === 0);
      filteredRet = filteredRet.filter(f => f.stopCount === 0);
    }

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      filteredOut = filteredOut.filter(f => selectedAirlines.includes(f.airline));
      filteredRet = filteredRet.filter(f => selectedAirlines.includes(f.airline));
    }

    // Sort
    const sortFlights = (flights: FlightData[]) => {
      switch (selectedSort) {
        case 'Price: Low to High':
          return flights.sort((a, b) => a.basePrice - b.basePrice);
        case 'Price: High to Low':
          return flights.sort((a, b) => b.basePrice - a.basePrice);
        case 'Duration: Shortest':
          return flights.sort((a, b) => a.duration - b.duration);
        default: // Best
          return flights.sort((a, b) => {
            const scoreA = a.basePrice + (a.stopCount * 100) + (a.duration / 60);
            const scoreB = b.basePrice + (b.stopCount * 100) + (b.duration / 60);
            return scoreA - scoreB;
          });
      }
    };

    filteredOut = sortFlights(filteredOut);
    filteredRet = sortFlights(filteredRet);

    setFilteredOutbound(filteredOut);
    setFilteredReturn(filteredRet);
  };

  const toggleAirline = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  const selectAllAirlines = () => {
    setSelectedAirlines([...allAirlines]);
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStopsText = (stopCount: number) => {
    if (stopCount === 0) return 'Nonstop';
    if (stopCount === 1) return '1 stop';
    return `${stopCount} stops`;
  };
// Dán code này vào file FlightSearchResults.tsx, thay thế hàm cũ

// Thay thế toàn bộ hàm handleFlightSelect cũ bằng hàm này
const handleFlightSelect = (flight: FlightData) => {
  const flightId = flight.flightId;
  console.log('🛫 Navigating with flight ID:', flightId);

  // Gói các tiêu chí tìm kiếm bạn đã có
  const searchParams = {
    from,
    to,
    departDate,
    returnDate,
    passengers,
    cabinClass,
    tripType
  };

  // Chuyển sang màn hình chi tiết, chỉ truyền ID và searchParams
  // Màn hình 'FlightBookingDetails' (chính là FlightDetailsScreen) sẽ tự fetch data
  navigation.navigate('FlightBookingDetails', { 
    flightId: flightId,       // <-- 1. Truyền ID
    searchParams: searchParams,// <-- 2. Truyền thông tin tìm kiếm (đổi tên từ searchCriteria)
     options: route.params.options  
  });
   
};


  const renderFlightCard = (flight: FlightData, isReturn: boolean = false) => (
    <TouchableOpacity 
      key={flight.flightId}
      style={styles.flightCard}
      onPress={() => handleFlightSelect(flight)}
      activeOpacity={0.7}
    >
      <View style={styles.flightInfo}>
        <View style={styles.flightIcon}>
          <Ionicons name="airplane" size={24} color="#00BCD4" />
        </View>
        
        <View style={styles.flightDetails}>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(flight.departureTime)}</Text>
            <View style={styles.durationLine}>
              <View style={styles.line} />
              {flight.stopCount > 0 && (
                <View style={styles.stopDot} />
              )}
            </View>
            <Text style={styles.time}>{formatTime(flight.arrivalTime)}</Text>
          </View>
          
          <View style={styles.airportRow}>
            <Text style={styles.airport}>{flight.departureAirport}</Text>
            <Text style={styles.airport}>{flight.arrivalAirport}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.airline}>{flight.airline}</Text>
            <Text style={styles.flightCode}>• {flight.flightCode}</Text>
          </View>
        </View>
        
        <View style={styles.flightMeta}>
          <Text style={styles.duration}>{formatDuration(flight.duration)}</Text>
          <Text style={styles.stops}>{getStopsText(flight.stopCount)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.seatsInfo}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.seatsText}>{flight.availableSeats} seats left</Text>
        </View>
        <Text style={styles.price}>${flight.basePrice.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.loadingText}>Đang tải chuyến bay...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalFlights = filteredOutbound.length + filteredReturn.length;
  const originalTotal = outboundFlights.length + returnFlights.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {from?.split(' (')[0] || 'Origin'} - {to?.split(' (')[0] || 'Destination'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {departDate || 'Date'}
            {returnDate ? ` - ${returnDate}` : ''}, 
            {' '}{passengers?.adults || 1} traveller{(passengers?.adults || 1) > 1 ? 's' : ''}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="tune" size={20} color="#000" />
          <Text style={styles.filterButtonText}>Sort & Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>{selectedSort}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>
            {selectedStops === 'Any stops' ? 'Stops' : selectedStops}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>Time</Text>
        </TouchableOpacity> 
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {totalFlights} {totalFlights === 1 ? 'flight' : 'flights'} found
        </Text>
      </View>

      {/* Flight List */}
      <ScrollView style={styles.flightList} showsVerticalScrollIndicator={false}>
        {/* Outbound Flights */}
        {filteredOutbound.length > 0 && (
          <View style={styles.flightSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="airplane" size={20} color="#00BCD4" />
              <Text style={styles.sectionTitle}>
                Outbound • {from?.split(' (')[0]} → {to?.split(' (')[0]}
              </Text>
            </View>
            {filteredOutbound.map(flight => renderFlightCard(flight, false))}
          </View>
        )}

        {/* Return Flights */}
        {filteredReturn.length > 0 && tripType === 'round-trip' && (
          <View style={styles.flightSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="airplane" size={20} color="#FF6B6B" style={{ transform: [{ rotate: '180deg' }] }} />
              <Text style={styles.sectionTitle}>
                Return • {to?.split(' (')[0]} → {from?.split(' (')[0]}
              </Text>
            </View>
            {filteredReturn.map(flight => renderFlightCard(flight, true))}
          </View>
        )}

        {/* No Results */}
        {totalFlights === 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="airplane-outline" size={64} color="#CCC" />
            <Text style={styles.noResultsTitle}>Không tìm thấy chuyến bay</Text>
            <Text style={styles.noResultsText}>
              Vui lòng thử thay đổi bộ lọc hoặc tiêu chí tìm kiếm
            </Text>
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedStops('Any stops');
                setSelectedAirlines([...allAirlines]);
                setSelectedSort('Best');
              }}
            >
              <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sort & Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Sorts & Filters</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Sort by */}
              <Text style={styles.sectionTitleModal}>Sort by</Text>
              <View style={styles.sortOptions}>
                {['Best', 'Price: Low to High', 'Price: High to Low', 'Duration: Shortest'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setSelectedSort(option)}
                  >
                    <Text style={styles.radioText}>{option}</Text>
                    {selectedSort === option && (
                      <Ionicons name="checkmark" size={24} color="#00BCD4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Stops */}
              <Text style={styles.sectionTitleModal}>Stops</Text>
              {['Any stops', '1 stop or nonstop', 'Nonstop only'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setSelectedStops(option)}
                >
                  <Text style={styles.radioText}>{option}</Text>
                  {selectedStops === option && (
                    <Ionicons name="checkmark" size={24} color="#00BCD4" />
                  )}
                </TouchableOpacity>
              ))}

              {/* Airlines */}
              {allAirlines.length > 0 && (
                <>
                  <Text style={styles.sectionTitleModal}>Airlines</Text>
                  <TouchableOpacity 
                    style={styles.checkboxOption}
                    onPress={selectAllAirlines}
                  >
                    <Text style={styles.checkboxText}>Select all</Text>
                    <View style={[
                      styles.checkbox,
                      selectedAirlines.length === allAirlines.length && styles.checkboxChecked
                    ]}>
                      {selectedAirlines.length === allAirlines.length && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>

                  {allAirlines.map((airline) => (
                    <TouchableOpacity 
                      key={airline}
                      style={styles.checkboxOption}
                      onPress={() => toggleAirline(airline)}
                    >
                      <Text style={styles.checkboxText}>{airline}</Text>
                      <View style={[
                        styles.checkbox,
                        selectedAirlines.includes(airline) && styles.checkboxChecked
                      ]}>
                        {selectedAirlines.includes(airline) && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSelectedStops('Any stops');
                  setSelectedAirlines([...allAirlines]);
                  setSelectedSort('Best');
                }}
              >
                <Text style={styles.clearButtonText}>Clear all</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.showButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.showButtonText}>
                  Show {totalFlights} of {originalTotal}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#000',
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipButtonText: {
    fontSize: 14,
    color: '#000',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  flightList: {
    flex: 1,
  },
  flightSection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  flightCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightInfo: {
    flexDirection: 'row',
  },
  flightIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightDetails: {
    flex: 1,
    marginLeft: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  durationLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  stopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    zIndex: 1,
  },
  airportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  airport: {
    fontSize: 12,
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  airline: {
    fontSize: 12,
    color: '#666',
  },
  flightCode: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  flightMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  stops: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatsText: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00BCD4',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  clearFiltersButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00BCD4',
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalBody: {
    padding: 20,
  },
  sectionTitleModal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
  },
  sortOptions: {
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  checkboxText: {
    fontSize: 16,
    color: '#000',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  showButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#00BCD4',
  },
  showButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FlightSearchResults;