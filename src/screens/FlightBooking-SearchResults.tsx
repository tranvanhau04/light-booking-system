import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import flightService, { Flight } from '../services/flightService';

interface FlightSearchResultsProps {
  navigation?: any;
  route?: any;
}

const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({ navigation, route }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Best');
  const [selectedStops, setSelectedStops] = useState('Any stops');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [allAirlines, setAllAirlines] = useState<string[]>([]);

  // Lấy params từ navigation
  const searchParams = route?.params || {
    from: 'London (LCY)',
    to: 'New York (JFK)',
    departDate: 'Jul 14',
    returnDate: 'Jul 17',
    travellers: 1,
    cabinClass: 'Economy',
  };

  useEffect(() => {
    // Search flights khi component mount
    const results = flightService.searchFlights(searchParams);
    setFlights(results);
    setFilteredFlights(results);

    // Lấy danh sách airlines duy nhất
    const airlines = [...new Set(results.map(f => f.airline))];
    setAllAirlines(airlines);
    setSelectedAirlines(airlines);
  }, []);

  useEffect(() => {
    // Apply filters và sort
    let filtered = [...flights];

    // Filter by stops
    filtered = flightService.filterByStops(filtered, selectedStops);

    // Filter by airlines
    filtered = flightService.filterByAirlines(filtered, selectedAirlines);

    // Sort
    filtered = flightService.sortFlights(filtered, selectedSort);

    setFilteredFlights(filtered);
  }, [flights, selectedStops, selectedAirlines, selectedSort]);

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

  const getFlightIcon = (flight: Flight) => {
    if (flight.icon === 'flash') {
      return <Ionicons name="flash" size={24} color={flight.iconColor} />;
    } else if (flight.icon === 'circle') {
      return <View style={[styles.circleIcon, { backgroundColor: flight.iconColor }]} />;
    }
    return <Ionicons name="airplane" size={24} color={flight.iconColor} />;
  };

  const handleFlightSelect = (flightId: string) => {
    console.log('Navigating to FlightBookingDetails with ID:', flightId);
    navigation.navigate('FlightBookingDetails', { 
      flightId: flightId,
      searchParams: searchParams 
    });
  };

  // Group flights by direction
  const groupedFlights: Flight[][] = [];
  let currentGroup: Flight[] = [];
  
  filteredFlights.forEach((flight, index) => {
    currentGroup.push(flight);
    
    const nextFlight = filteredFlights[index + 1];
    if (!nextFlight || nextFlight.departureCity !== flight.departureCity) {
      groupedFlights.push([...currentGroup]);
      currentGroup = [];
    }
  });

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
            {searchParams.from?.split(' (')[0] || 'London'} - {searchParams.to?.split(' (')[0] || 'New York'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {searchParams.departDate || 'Jul 14'}
            {searchParams.returnDate ? ` - ${searchParams.returnDate}` : ''}, 
            {' '}{searchParams.travellers || 1} traveller{(searchParams.travellers || 1) > 1 ? 's' : ''}
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
          <Text style={styles.chipButtonText}>{selectedStops === 'Any stops' ? 'Stops' : selectedStops}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>Time</Text>
        </TouchableOpacity>
      </View>

      {/* Flight List */}
      <ScrollView style={styles.flightList} showsVerticalScrollIndicator={false}>
        {groupedFlights.map((group, groupIndex) => (
          <View key={groupIndex}>
            {group.map((flight, flightIndex) => (
              <TouchableOpacity 
                key={flight.id}
                style={styles.flightCard}
                onPress={() => handleFlightSelect(flight.id)}
                activeOpacity={0.7}
              >
                <View style={styles.flightInfo}>
                  <View style={styles.flightIcon}>
                    {getFlightIcon(flight)}
                  </View>
                  
                  <View style={styles.flightDetails}>
                    <View style={styles.timeRow}>
                      <Text style={styles.time}>{flight.departureTime}</Text>
                      <View style={styles.durationLine}>
                        <View style={styles.line} />
                      </View>
                      <Text style={styles.time}>{flight.arrivalTime}</Text>
                    </View>
                    
                    <View style={styles.airportRow}>
                      <Text style={styles.airport}>{flight.departureAirport}</Text>
                      <Text style={styles.airport}>{flight.arrivalAirport}</Text>
                    </View>
                    
                    <Text style={styles.airline}>{flight.airline}</Text>
                  </View>
                  
                  <View style={styles.flightMeta}>
                    <Text style={styles.duration}>{flight.duration}</Text>
                    <Text style={styles.stops}>{flight.stopsText}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.groupFooter}
              onPress={() => handleFlightSelect(group[group.length - 1].id)}
              activeOpacity={0.7}
            >
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  console.log('Favorite toggled for:', group[group.length - 1].id);
                }}
              >
                <Ionicons name="heart-outline" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.price}>${group[group.length - 1].price}</Text>
            </TouchableOpacity>
          </View>
        ))}
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
              <Text style={styles.sectionTitle}>Sort by</Text>
              <View style={styles.sortOptions}>
                {['Best', 'Price: Low to High', 'Price: High to Low', 'Duration: Shortest'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setSelectedSort(option)}
                  >
                    <Text style={styles.radioText}>{option}</Text>
                    {selectedSort === option && (
                      <Ionicons name="checkmark" size={24} color="#6B46C1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Stops */}
              <Text style={styles.sectionTitle}>Stops</Text>
              {['Any stops', '1 stop or nonstop', 'Nonstop only'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setSelectedStops(option)}
                >
                  <Text style={styles.radioText}>{option}</Text>
                  {selectedStops === option && (
                    <Ionicons name="checkmark" size={24} color="#6B46C1" />
                  )}
                </TouchableOpacity>
              ))}

              {/* Airlines */}
              <Text style={styles.sectionTitle}>Airlines</Text>
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
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSelectedStops('Any stops');
                  setSelectedAirlines([]);
                  setSelectedSort('Best');
                }}
              >
                <Text style={styles.clearButtonText}>Clear all</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.showButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.showButtonText}>Show {filteredFlights.length} of {flights.length}</Text>
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
  flightList: {
    flex: 1,
  },
  flightCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  flightInfo: {
    flexDirection: 'row',
  },
  flightIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  flightDetails: {
    flex: 1,
    marginLeft: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  line: {
    height: '100%',
    backgroundColor: '#E0E0E0',
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
  airline: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  flightMeta: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  stops: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
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
  sectionTitle: {
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
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
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