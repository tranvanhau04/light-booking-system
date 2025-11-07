import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TripType = 'round-trip' | 'one-way' | 'multi-city';
type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

interface Flight {
  from: string;
  to: string;
  date: string;
}

interface Airport {
  name: string;
  city: string;
  code: string;
  country?: string;
}



const FlightSearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loadingAirports, setLoadingAirports] = useState<boolean>(false);
  const [errorAirports, setErrorAirports] = useState<string | null>(null);

  // 👇 đặt ở đầu component (cùng chỗ với các useState khác)
  const [selectedBaggageOption, setSelectedBaggageOption] = useState(null);
  const [selectedSeatType, setSelectedSeatType] = useState(null);
  const [selectedMealOption, setSelectedMealOption] = useState(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',  // Fri
      month: 'short',    // Jul
      day: '2-digit',    // 14
    });
  };

  const today = new Date();

  const [flights, setFlights] = useState<Flight[]>([
    { from: '', to: '', date: formatDate(today) },
    { from: '', to: '', date: formatDate(today) },
  ]);
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState(formatDate(today));
  const [returnDate, setReturnDate] = useState(formatDate(today));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');



  // Modals
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
    const fetchAirports = async () => {
      try {
        setLoadingAirports(true);
        setErrorAirports(null);

        const response = await axios.get("http://localhost:8080/api/airports");
        // backend trả về { success: true, message, data: [...] }
        const data = response.data?.data ?? response.data; // robust
        setAirports(data as Airport[]);
      } catch (err: any) {
        console.error("Error fetching airports:", err);
        setErrorAirports(err?.message ?? "Unknown error");
      } finally {
        setLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);



  const addFlight = () => {
    setFlights([...flights, { from: '', to: '', date: 'Fri, Jul 14' }]);
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const selectAirport = (airport: Airport, isFrom: boolean) => {
    const cityWithCode = `${airport.city} (${airport.code})`;
    if (tripType === 'multi-city') {
      const updatedFlights = [...flights];
      if (isFrom) {
        updatedFlights[selectedFlightIndex].from = cityWithCode;
      } else {
        updatedFlights[selectedFlightIndex].to = cityWithCode;
      }
      setFlights(updatedFlights);
    } else {
      if (isFrom) {
        setFrom(cityWithCode);
        setShowFromModal(false);
      } else {
        setTo(cityWithCode);
        setShowToModal(false);
      }
    }
    setSearchQuery('');
    if (isFrom) {
      setShowFromModal(false);
    } else {
      setShowToModal(false);
    }
  };

  const getDayName = (day: number) => {
    const date = new Date(2025, 6, day); // July 2025
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleDaySelect = (day: number) => {
    if (tripType === 'multi-city') {
      const updatedFlights = [...flights];
      const dayName = getDayName(day);
      updatedFlights[selectedFlightIndex].date = `${dayName}, Jul ${day}`;
      setFlights(updatedFlights);
    } else if (isSelectingDepartDate) {
      setSelectedDay(day);
      const dayName = getDayName(day);
      setDepartDate(`${dayName}, Jul ${day}`);
      if (tripType === 'round-trip') {
        setIsSelectingDepartDate(false);
      }
    } else {
      setSelectedReturnDay(day);
      const dayName = getDayName(day);
      setReturnDate(`${dayName}, Jul ${day}`);
    }
  };

  const filteredAirports = airports.filter((airport: Airport) =>
    (airport.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (airport.code || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (airport.city || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (airport.country || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );


  // Options Modal
  const renderOptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.sectionTitle}>Traveller</Text>

            <View style={styles.counterRow}>
              <View>
                <Text style={styles.counterLabel}>Adults</Text>
                <Text style={styles.counterSubLabel}>12+ years</Text>
              </View>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => adults > 1 && setAdults(adults - 1)}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{adults}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setAdults(adults + 1)}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterRow}>
              <View>
                <Text style={styles.counterLabel}>Children</Text>
                <Text style={styles.counterSubLabel}>2-12 years</Text>
              </View>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => children > 0 && setChildren(children - 1)}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{children}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setChildren(children + 1)}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterRow}>
              <View>
                <Text style={styles.counterLabel}>Infants</Text>
                <Text style={styles.counterSubLabel}>Under 2 years</Text>
              </View>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => infants > 0 && setInfants(infants - 1)}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{infants}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setInfants(infants + 1)}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Cabin Class</Text>

            {(['Economy', 'Premium Economy', 'Business', 'First'] as CabinClass[]).map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.classOption}
                onPress={() => setCabinClass(className)}
              >
                <Text style={styles.classOptionText}>{className}</Text>
                {cabinClass === className && (
                  <MaterialCommunityIcons name="check" size={24} color="#00BCD4" />
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.modalFooter}>
              <Text style={styles.tripTypeLabel}>{tripType === 'round-trip' ? 'Round-trip' : tripType === 'one-way' ? 'One-way' : 'Multi-city'}</Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowOptionsModal(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  // Date Modal
  const renderDateModal = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Hàm tạo danh sách tháng từ tháng hiện tại -> 12 tháng tới
    const generateMonths = () => {
      const months: { name: string; year: number; month: number; days: number; firstDay: number }[] = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth + i, 1);
        const name = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        months.push({ name, year, month, days, firstDay });
      }
      return months;
    };

    const months = generateMonths();

    const handleDaySelectDynamic = (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (tripType === 'multi-city') {
        const updatedFlights = [...flights];
        updatedFlights[selectedFlightIndex].date = formatted;
        setFlights(updatedFlights);
      } else if (isSelectingDepartDate) {
        setDepartDate(formatted);
        if (tripType === 'round-trip') setIsSelectingDepartDate(false);
      } else {
        setReturnDate(formatted);
      }
    };

    return (
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowDateModal(false);
          setIsSelectingDepartDate(true);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDateModal(false);
                  setIsSelectingDepartDate(true);
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Thanh chọn ngày đi / ngày về */}
            <View style={styles.dateSelector}>
              <TouchableOpacity
                style={[styles.dateItem, isSelectingDepartDate && styles.dateItemActive]}
                onPress={() => setIsSelectingDepartDate(true)}
              >
                <MaterialCommunityIcons name="airplane-takeoff" size={20} color={isSelectingDepartDate ? "#00BCD4" : "#666"} />
                <Text style={[styles.dateText, isSelectingDepartDate && styles.dateTextActive]}>{departDate}</Text>
              </TouchableOpacity>
              {tripType === 'round-trip' && (
                <TouchableOpacity
                  style={[styles.dateItem, !isSelectingDepartDate && styles.dateItemActive]}
                  onPress={() => setIsSelectingDepartDate(false)}
                >
                  <MaterialCommunityIcons name="airplane-landing" size={20} color={!isSelectingDepartDate ? "#00BCD4" : "#666"} />
                  <Text style={[styles.dateText, !isSelectingDepartDate && styles.dateTextActive]}>{returnDate}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Cuộn qua các tháng */}
            <ScrollView>
              {months.map((m, idx) => (
                <View key={idx} style={styles.calendar}>
                  <Text style={styles.monthTitle}>{`${m.name} ${m.year}`}</Text>
                  <View style={styles.weekDays}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <Text key={i} style={styles.weekDay}>{day}</Text>
                    ))}
                  </View>
                  <View style={styles.daysGrid}>
                    {/* Căn ngày đầu tháng */}
                    {Array.from({ length: m.firstDay }).map((_, i) => (
                      <View key={`empty-${i}-${idx}`} style={[styles.dayCell]} />
                    ))}
                    {/* Ngày trong tháng */}
                    {Array.from({ length: m.days }, (_, d) => d + 1).map((day) => {
                      const isSelected =
                        (isSelectingDepartDate && departDate.includes(`${m.name.slice(0, 3)} ${day}`)) ||
                        (!isSelectingDepartDate && returnDate.includes(`${m.name.slice(0, 3)} ${day}`));

                      return (
                        <TouchableOpacity
                          key={`${m.name}-${day}`}
                          style={[styles.dayCell, isSelected && styles.selectedDay]}
                          onPress={() => handleDaySelectDynamic(m.year, m.month, day)}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              isSelected && styles.selectedDayText,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.tripTypeLabel}>
                {isSelectingDepartDate ? 'Departure Date' : 'Return Date'}
              </Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  setShowDateModal(false);
                  setIsSelectingDepartDate(true);
                }}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Location Modal (From/To)
  const renderLocationModal = (isFrom: boolean) => (
    <Modal
      visible={isFrom ? showFromModal : showToModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        isFrom ? setShowFromModal(false) : setShowToModal(false);
        setSearchQuery('');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isFrom ? 'Where from?' : 'Where to?'}</Text>
            <TouchableOpacity onPress={() => {
              isFrom ? setShowFromModal(false) : setShowToModal(false);
              setSearchQuery('');
            }}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.locationInputs}>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="magnify" size={20} color="#666" />
              <TextInput
                style={styles.locationInput}
                placeholder={isFrom ? "Search departure airport" : "Search destination airport"}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          </View>

          <ScrollView style={styles.locationResults}>
            {loadingAirports && <Text>Loading airports...</Text>}
            {!loadingAirports && filteredAirports.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No airports found</Text>
            )}
            {filteredAirports.map((airport, index) => (
              <TouchableOpacity
                key={airport.code + index}
                style={styles.airportItem}
                onPress={() => selectAirport(airport, isFrom)}
              >
                <MaterialCommunityIcons name="airplane" size={24} color="#666" />
                <View style={styles.airportInfo}>
                  <Text style={styles.airportName}>{airport.code} — {airport.name}</Text>
                  <Text style={styles.airportDistance}>{airport.city}{airport.country ? `, ${airport.country}` : ''}</Text>
                </View>
                <Text style={styles.airportCode}>{airport.code}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Trip Type Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tripType === 'round-trip' && styles.activeTab]}
          onPress={() => setTripType('round-trip')}
        >
          <Text style={[styles.tabText, tripType === 'round-trip' && styles.activeTabText]}>
            Round-trip
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tripType === 'one-way' && styles.activeTab]}
          onPress={() => setTripType('one-way')}
        >
          <Text style={[styles.tabText, tripType === 'one-way' && styles.activeTabText]}>
            One-way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tripType === 'multi-city' && styles.activeTab]}
          onPress={() => setTripType('multi-city')}
        >
          <Text style={[styles.tabText, tripType === 'multi-city' && styles.activeTabText]}>
            Multi-city
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {tripType === 'multi-city' ? (
          <>
            {flights.map((flight, index) => (
              <View key={index} style={styles.flightSection}>
                <Text style={styles.flightLabel}>Flight {index + 1}</Text>
                <View style={styles.locationInputsContainer}>
                  <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => {
                      setSelectedFlightIndex(index);
                      setShowFromModal(true);
                    }}
                  >
                    <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#999" />
                    <Text style={[styles.inputPlaceholder, flight.from && styles.inputValue]}>
                      {flight.from || 'From'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => {
                      setSelectedFlightIndex(index);
                      setShowToModal(true);
                    }}
                  >
                    <MaterialCommunityIcons name="airplane-landing" size={20} color="#999" />
                    <Text style={[styles.inputPlaceholder, flight.to && styles.inputValue]}>
                      {flight.to || 'To'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => {
                    setSelectedFlightIndex(index);
                    setShowDateModal(true);
                  }}
                >
                  <MaterialCommunityIcons name="calendar" size={20} color="#999" />
                  <Text style={styles.inputPlaceholder}>{flight.date}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addFlightButton} onPress={addFlight}>
              <Text style={styles.addFlightText}>Add flight</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.flightSection}>
            <View style={styles.locationInputsContainer}>
              <TouchableOpacity
                style={styles.inputField}
                onPress={() => setShowFromModal(true)}
              >
                <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#999" />
                <Text style={[styles.inputPlaceholder, from && styles.inputValue]}>
                  {from || 'From'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                <MaterialCommunityIcons name="swap-vertical" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inputField}
                onPress={() => setShowToModal(true)}
              >
                <MaterialCommunityIcons name="airplane-landing" size={20} color="#999" />
                <Text style={[styles.inputPlaceholder, to && styles.inputValue]}>
                  {to || 'To'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.inputField, { flex: 1, marginRight: tripType === 'round-trip' ? 8 : 0 }]}
                onPress={() => setShowDateModal(true)}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#999" />
                <Text style={styles.inputPlaceholder}>{departDate}</Text>
              </TouchableOpacity>
              {tripType === 'round-trip' && (
                <TouchableOpacity
                  style={[styles.inputField, { flex: 1 }]}
                  onPress={() => setShowDateModal(true)}
                >
                  <MaterialCommunityIcons name="calendar" size={20} color="#999" />
                  <Text style={styles.inputPlaceholder}>{returnDate}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Traveller and Class Selection */}
        <TouchableOpacity
          style={styles.travellerButton}
          onPress={() => setShowOptionsModal(true)}
        >
          <View style={styles.travellerInfo}>
            <MaterialCommunityIcons name="account" size={20} color="#666" />
            <Text style={styles.travellerText}>{totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}</Text>
            <Text style={styles.bulletPoint}>•</Text>
            <MaterialCommunityIcons name="seat-passenger" size={16} color="#666" />
            <Text style={styles.travellerText}>{cabinClass}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Search Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={async () => {
            console.log('🔍 Search button pressed');

            try {
              // Prepare search parameters
              const searchParams = {
                from: from || 'London City (LCY)',
                to: to || 'John F Kennedy (JFK)',
                departDate: departDate,
                returnDate: tripType === 'round-trip' ? returnDate : undefined,
                passengers: totalTravellers,
                cabinClass: cabinClass,
                tripType: tripType
              };

              console.log('📤 Sending search params:', searchParams);

              // Call API
              const response = await axios.get('http://localhost:8080/api/flights/search', {
                params: searchParams
              });

              console.log('📥 Search response:', response.data);

              if (response.data.success) {
                const { outboundFlights, returnFlights, searchCriteria } = response.data.data;

                console.log(`✈️ Found ${outboundFlights.length} outbound flights`);
                console.log(`🔙 Found ${returnFlights.length} return flights`);
                const options = {
                  travellers: {
                    adults,
                    children,
                    infants
                  },
                  cabinClass: searchCriteria.cabinClass
                };


                // Navigate to results page with data
                navigation.navigate('FlightBookingSearchResults', {
                  outboundFlights,
                  returnFlights,
                  searchCriteria,
                  from: searchCriteria.from,
                  to: searchCriteria.to,
                  departDate: searchCriteria.departDate,
                  returnDate: searchCriteria.returnDate,
                  tripType: searchCriteria.tripType,
                  passengers: {
                    adults: adults,
                    children: children,
                    infants: infants
                  },
                  cabinClass: searchCriteria.cabinClass,
                  options
                });
              } else {
                // No flights found
                Alert.alert(
                  'No Flights Found',
                  response.data.message || 'No flights match your search criteria. Please try different dates or destinations.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error: any) {
              console.error('❌ Error searching flights:', error);

              let errorMessage = 'Unable to search flights. Please check your connection and try again.';

              if (error.response) {
                console.error('Error response:', error.response.data);
                errorMessage = error.response.data.message || errorMessage;
              }

              Alert.alert(
                'Search Error',
                errorMessage,
                [{ text: 'OK' }]
              );
            }
          }}
        >
          <Text style={styles.searchButtonText}>Search flights</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderOptionsModal()}
      {renderDateModal()}
      {renderLocationModal(true)}
      {renderLocationModal(false)}
    </View>
  );
};

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