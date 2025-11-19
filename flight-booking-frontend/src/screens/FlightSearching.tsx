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
  StatusBar,
  KeyboardAvoidingView, 
  Platform, 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type TripType = 'round-trip' | 'one-way' | 'multi-city';
type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

interface Airport {
  name: string;
  city: string;
  code: string;
  country?: string;
}

interface Flight {
  from: Airport | null; 
  to: Airport | null;   
  date: string;
}

const FlightSearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loadingAirports, setLoadingAirports] = useState<boolean>(false);
  const [errorAirports, setErrorAirports] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });
  };

  const today = new Date();

  const [flights, setFlights] = useState<Flight[]>([
    { from: null, to: null, date: formatDate(today) },
    { from: null, to: null, date: formatDate(today) },
  ]);
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [departDate, setDepartDate] = useState(formatDate(today));
  const [returnDate, setReturnDate] = useState(formatDate(today));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');
  const [fromAirport, setFromAirport] = useState<Airport | null>(null); 
  const [toAirport, setToAirport] = useState<Airport | null>(null);

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

        // Lấy danh sách airports từ Flight table
        const response = await axios.get("http://192.168.1.31:5000/api/flights/airports-from-flights");
        
        const data = response.data?.data ?? response.data;
        console.log('✈️ Loaded airports:', data);
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
    setFlights([...flights, { from: null, to: null, date: formatDate(today) }]);
  };

  const swapLocations = () => {
    const temp = fromAirport;     
    setFromAirport(toAirport); 
    setToAirport(temp);        
  };

  const selectAirport = (airport: Airport, isFrom: boolean) => {
    if (tripType === 'multi-city') {
      const updatedFlights = [...flights];
      if (isFrom) {
        updatedFlights[selectedFlightIndex].from = airport; 
      } else {
        updatedFlights[selectedFlightIndex].to = airport;   
      }
      setFlights(updatedFlights);
    } else {
      if (isFrom) {
        setFromAirport(airport);
        setShowFromModal(false);
      } else {
        setToAirport(airport);
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
    const date = new Date(2025, 6, day);
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

  // Logic lọc airports với useMemo để optimize
  // Trong FlightSearchScreen component, thay thế hoặc bổ sung logic này:

// Logic lọc airports với useMemo để optimize
const groupedAirports = React.useMemo(() => {
    if (!searchQuery.trim() || airports.length === 0) {
        return {};
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = airports.filter((airport: Airport) =>
        (airport.name || "").toLowerCase().includes(query) ||
        (airport.code || "").toLowerCase().includes(query) ||
        (airport.city || "").toLowerCase().includes(query)
    );

    // 1. Nhóm các sân bay theo Thành phố (City)
    const grouped: Record<string, Airport[]> = filtered.reduce((acc, airport) => {
        const key = `${airport.city}, ${airport.country || 'Unknown'}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(airport);
        return acc;
    }, {} as Record<string, Airport[]>);
    
    return grouped;
}, [searchQuery, airports]);

// Hàm này giúp lấy tổng số kết quả (để hiển thị "X results")
const totalResults = Object.values(groupedAirports).reduce((count, arr) => count + arr.length, 0);

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

    const generateMonths = () => {
      const months: { name: string; year: number; month: number; days: number; firstDay: number }[] = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth + i, 1);
        const name = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
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
                    {Array.from({ length: m.firstDay }).map((_, i) => (
                      <View key={`empty-${i}-${idx}`} style={[styles.dayCell]} />
                    ))}
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

  // Location Modal
  const renderLocationModal = (isFrom: boolean) => {
    return (
      <Modal
        visible={isFrom ? showFromModal : showToModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          isFrom ? setShowFromModal(false) : setShowToModal(false);
          setSearchQuery('');
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
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
    {loadingAirports ? (
        <Text style={styles.loadingText}>Loading airports...</Text>
    ) : (
        <>
            {/* Hiển thị Empty State nếu không có kết quả */}
            {searchQuery.trim() !== '' && totalResults === 0 && (
                 <View style={styles.emptyState}>
                   <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ccc" />
                   <Text style={styles.emptyStateText}>No airports found</Text>
                   <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
                 </View>
            )}

            {/* Hiển thị kết quả tìm kiếm đã nhóm */}
            {totalResults > 0 && (
                <>
                    <Text style={styles.resultsCount}>
                        Found {totalResults} result{totalResults > 1 ? 's' : ''} for "{searchQuery}"
                    </Text>
                    {/* Lặp qua các nhóm thành phố */}
                    {Object.entries(groupedAirports).map(([cityKey, cityAirports]) => (
                        <View key={cityKey} style={styles.cityGroup}>
                            {/* Dòng hiển thị Tên Thành phố (Ví dụ: London, United Kingdom) */}
                            <View style={styles.cityHeader}>
                                <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
                                <Text style={styles.cityTitle}>{cityKey}</Text>
                                {/* Thêm nút mũi tên sổ xuống/lên nếu bạn muốn tính năng thu gọn */}
                                <MaterialCommunityIcons name="chevron-up" size={18} color="#666" />
                            </View>
                            
                            {/* Lặp qua các Sân bay trong thành phố đó */}
                            {cityAirports.map((airport, index) => (
                                <TouchableOpacity
                                    key={`${airport.code}-${index}`}
                                    style={styles.airportItemDetail} // Sử dụng style mới cho chi tiết sân bay
                                    onPress={() => selectAirport(airport, isFrom)}
                                >
                                    <MaterialCommunityIcons name="airplane" size={24} color="#999" />
                                    <View style={styles.airportInfo}>
                                        <Text style={styles.airportNameDetail}>
                                            {airport.name}
                                        </Text>
                                        <Text style={styles.airportSubtextDetail}>
                                            {/* Giả lập khoảng cách, bạn có thể bỏ qua nếu không có data */}
                                            {/* Ví dụ: 20 km to destination */}
                                            15 km to destination
                                        </Text>
                                    </View>
                                    <Text style={styles.airportCode}>{airport.code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </>
            )}

            {/* Giữ lại Empty State ban đầu cho trường hợp chưa nhập gì */}
            {searchQuery.trim() === '' && (
                 <View style={styles.emptyState}>
                   <MaterialCommunityIcons name="magnify" size={48} color="#ccc" />
                   <Text style={styles.emptyStateText}>Search for airports or cities</Text>
                   <Text style={styles.emptyStateSubtext}>Try: London, New York, JFK...</Text>
                 </View>
            )}
        </>
    )}
</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}> 
      <StatusBar barStyle="dark-content" /> 

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight</Text>
        <View style={{ width: 24 }} />
      </View>

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
                      {flight.from ? `${flight.from.city} (${flight.from.code})` : 'From'}
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
                      {flight.to ? `${flight.to.city} (${flight.to.code})` : 'To'}
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
                <Text style={[styles.inputPlaceholder, fromAirport && styles.inputValue]}>
                  {fromAirport ? `${fromAirport.city} (${fromAirport.code})` : 'From'}
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
                <Text style={[styles.inputPlaceholder, toAirport && styles.inputValue]}>
                  {toAirport ? `${toAirport.city} (${toAirport.code})` : 'To'}
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

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={async () => {
            console.log('🔍 Search button pressed');
            if (!fromAirport || !toAirport) {
              Alert.alert('Incomplete', 'Please select departure and destination airports.');
              return;
            }
            try {
              const searchParams = {
                from: fromAirport.name,
                to: toAirport.name,
                departDate: departDate,
                returnDate: tripType === 'round-trip' ? returnDate : undefined,
                passengers: totalTravellers,
                cabinClass: cabinClass,
                tripType: tripType
              };

              console.log('📤 Sending search params:', searchParams);

              const response = await axios.get('http://192.168.1.31:5000/api/flights/search', {
                params: searchParams
              });

              console.log('📥 Search response:', response.data);

              if (response.data.success) {
                const { outboundFlights, returnFlights, searchCriteria } = response.data.data;

                console.log(`✈️ Found ${outboundFlights.length} outbound flights`);
                console.log(`🔙 Found ${returnFlights.length} return flights`);

                navigation.navigate('List', {
                  outboundFlights,
                  returnFlights,
                  searchCriteria,
                  passengers: {
                    adults: adults,
                    children: children,
                    infants: infants
                  },
                });
              } else {
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

      {renderOptionsModal()}
      {renderDateModal()}
      {renderLocationModal(true)}
      {renderLocationModal(false)}
    </SafeAreaView>
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
    width: '100%',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  resultsCount: {
    fontSize: 12,
    color: '#999',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  airportSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  airportCountry: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  cityGroup: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  cityTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  airportItemDetail: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 30, 
  },
  airportNameDetail: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  airportSubtextDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default FlightSearchScreen;