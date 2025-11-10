import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Flight, Itinerary } from '../types/flight'; // Import types

// =================================================================
// ĐỊNH NGHĨA TYPES
// =================================================================
type FilterScreenRouteProp = RouteProp<{
  params: {
    // Dữ liệu gốc
    outboundFlights: Flight[];
    returnFlights: Flight[]; 
    searchCriteria: { tripType: string };
    allAirlines: string[];
    passengers: PassengerCount; // <--- THÊM DÒNG NÀY
    
    // Bộ lọc hiện tại
    currentSort: string;
    currentStops: string;
    currentAirlines: string[];
  }
}, 'params'>;
interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}
// =================================================================
// COMPONENT CHÍNH
// =================================================================
const FlightSearchResults: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<FilterScreenRouteProp>();

  // Lấy params từ navigation
  const {
    outboundFlights = [],
    returnFlights = [],
    searchCriteria,
    allAirlines = [],
    currentSort,
    currentStops,
    currentAirlines
  } = route.params || {};

  // State cho các lựa chọn TẠM THỜI trên màn hình này
  const [selectedSort, setSelectedSort] = useState(currentSort || 'Best');
  const [selectedStops, setSelectedStops] = useState(currentStops || 'Any stops');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(currentAirlines || allAirlines);

  // TÍNH TOÁN SỐ LƯỢNG KẾT QUẢ (Để hiển thị trên nút "Show")
  // Logic này sao chép từ FlightListScreen để đếm số lượng
  const { totalFlightsFound, originalTotal } = useMemo(() => {
    let filteredOut = [...outboundFlights];
    let filteredRet = [...returnFlights];

    // Filter stops
    if (selectedStops === '1 stop or nonstop') {
      filteredOut = filteredOut.filter(f => f.stopCount <= 1);
      filteredRet = filteredRet.filter(f => f.stopCount <= 1);
    } else if (selectedStops === 'Nonstop only') {
      filteredOut = filteredOut.filter(f => f.stopCount === 0);
      filteredRet = filteredRet.filter(f => f.stopCount === 0);
    }

    // Filter airlines
    if (selectedAirlines.length > 0 && selectedAirlines.length < allAirlines.length) {
      filteredOut = filteredOut.filter(f => selectedAirlines.includes(f.airline));
      filteredRet = filteredRet.filter(f => selectedAirlines.includes(f.airline));
    }

    // Tính tổng
    let total = 0;
    let original = 0;

    if (searchCriteria?.tripType === 'round-trip' && returnFlights.length > 0) {
      total = filteredOut.length * filteredRet.length;
      original = outboundFlights.length * returnFlights.length;
    } else {
      total = filteredOut.length;
      original = outboundFlights.length;
    }
    return { totalFlightsFound: total, originalTotal: original };
  }, [outboundFlights, returnFlights, selectedStops, selectedAirlines, allAirlines, searchCriteria?.tripType]);


  const toggleAirline = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  const selectAllAirlines = () => {
    if (selectedAirlines.length === allAirlines.length) {
        setSelectedAirlines([]);
    } else {
        setSelectedAirlines([...allAirlines]);
    }
  };

  // HÀM QUAN TRỌNG: Gửi bộ lọc mới về màn hình List
  const handleShowResults = () => {
    // Quay về màn hình 'List' và gửi các bộ lọc mới
    navigation.navigate('List', {
        // Gửi các bộ lọc MỚI
        newSort: selectedSort,
        newStops: selectedStops,
        newAirlines: selectedAirlines,
        
        // Gửi lại các params gốc (để 'List' không bị mất)
        outboundFlights: outboundFlights,
        returnFlights: returnFlights,
        searchCriteria: searchCriteria,
        passengers: route.params.passengers // Lấy từ route.params
    });
  };

  const handleClearAll = () => {
    setSelectedStops('Any stops');
    setSelectedAirlines([...allAirlines]);
    setSelectedSort('Best');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Đây là toàn bộ giao diện Modal của bạn */}
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
            onPress={handleClearAll}
          >
            <Text style={styles.clearButtonText}>Clear all</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.showButton}
            onPress={handleShowResults}
          >
            <Text style={styles.showButtonText}>
              Show {totalFlightsFound} of {originalTotal}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// =================================================================
// STYLES (Lấy từ file FlightSearchResults.tsx)
// =================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Màu nền mờ
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    // Xóa border radius nếu đây là toàn màn hình
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
    flex: 1, // Tự động chiếm không gian
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