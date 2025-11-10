import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  ScrollView, // Import ScrollView
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import FlightCard from '../components/FlightCard'; 
import { Flight, Itinerary } from '../types/flight'; // Đảm bảo đường dẫn này đúng

// =================================================================
// ĐỊNH NGHĨA TYPES
// =================================================================
type FlightListScreenRouteProp = RouteProp<{
  params: {
    // Dữ liệu gốc
    outboundFlights: Flight[];
    returnFlights: Flight[]; 
    searchCriteria: { from: string; to: string; departDate: string; returnDate?: string; tripType: string };
    passengers: { adults: number; children: number; infants: number; };

    // Dữ liệu bộ lọc (nhận về từ màn hình Filter)
    newSort?: string;
    newStops?: string;
    newAirlines?: string[];
  }
}, 'params'>;

// =================================================================
// COMPONENT CHÍNH
// =================================================================
const FlightListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<FlightListScreenRouteProp>();

  // Dữ liệu gốc (không bao giờ thay đổi)
  const {
    outboundFlights: paramOutbound,
    returnFlights: paramReturn,
    searchCriteria,
    passengers
  } = route.params || {};

  // Lấy danh sách tất cả hãng bay (chỉ 1 lần)
  const allAirlines = useMemo(() => {
    if (!paramOutbound) return [];
    const all = [...paramOutbound, ...(paramReturn || [])];
    return [...new Set(all.map(f => f.airline))];
  }, [paramOutbound, paramReturn]);

  // State cho bộ lọc (filters) - Đây là "nguồn sự thật"
  const [selectedSort, setSelectedSort] = useState('Best');
  const [selectedStops, setSelectedStops] = useState('Any stops');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(allAirlines);
  
  // Cập nhật state ban đầu của selectedAirlines khi allAirlines đã sẵn sàng
  useEffect(() => {
    setSelectedAirlines(allAirlines);
  }, [allAirlines]);

  // Lắng nghe bộ lọc mới từ màn hình Filter (khi quay về)
  useEffect(() => {
    if (route.params.newSort) {
      setSelectedSort(route.params.newSort);
    }
    if (route.params.newStops) {
      setSelectedStops(route.params.newStops);
    }
    if (route.params.newAirlines) {
      setSelectedAirlines(route.params.newAirlines);
    }
  }, [route.params.newSort, route.params.newStops, route.params.newAirlines]);


  // TẠO DANH SÁCH LỊCH TRÌNH (ITINERARIES) DỰA TRÊN BỘ LỌC
  const itineraries = useMemo((): Itinerary[] => {
    if (!paramOutbound) return []; 
    
    let filteredOut = [...paramOutbound];
    let filteredRet = [...(paramReturn || [])];

    // 1. Lọc (Filter)
    if (selectedStops === '1 stop or nonstop') {
      filteredOut = filteredOut.filter(f => f.stopCount <= 1);
      filteredRet = filteredRet.filter(f => f.stopCount <= 1);
    } else if (selectedStops === 'Nonstop only') {
      filteredOut = filteredOut.filter(f => f.stopCount === 0);
      filteredRet = filteredRet.filter(f => f.stopCount === 0);
    }

    if (selectedAirlines.length > 0 && selectedAirlines.length < allAirlines.length) {
      filteredOut = filteredOut.filter(f => selectedAirlines.includes(f.airline));
      filteredRet = filteredRet.filter(f => selectedAirlines.includes(f.airline));
    }

    // 2. Ghép cặp (Pairing)
    let pairs: Itinerary[] = [];
    if (searchCriteria?.tripType === 'round-trip' && filteredRet.length > 0) {
      filteredOut.forEach(outbound => {
        filteredRet.forEach(ret => {
          pairs.push({
            id: `${outbound.flightId}-${ret.flightId}`,
            outboundFlight: outbound,
            returnFlight: ret,
            totalPrice: outbound.basePrice + ret.basePrice,
          });
        });
      });
    } else {
      pairs = filteredOut.map(outbound => ({
        id: outbound.flightId,
        outboundFlight: outbound,
        returnFlight: null,
        totalPrice: outbound.basePrice,
      }));
    }

    // 3. Sắp xếp (Sort)
    switch (selectedSort) {
      case 'Price: Low to High':
        return pairs.sort((a, b) => a.totalPrice - b.totalPrice);
      case 'Price: High to Low':
        return pairs.sort((a, b) => b.totalPrice - a.totalPrice);
      case 'Duration: Shortest':
        return pairs.sort((a, b) => {
          const durationA = a.outboundFlight.duration + (a.returnFlight?.duration || 0);
          const durationB = b.outboundFlight.duration + (b.returnFlight?.duration || 0);
          return durationA - durationB;
        });
      default: // Best
        return pairs.sort((a, b) => {
          const scoreA = a.totalPrice + (a.outboundFlight.stopCount * 100) + (a.outboundFlight.duration / 60);
          const scoreB = b.totalPrice + (b.outboundFlight.stopCount * 100) + (b.outboundFlight.duration / 60);
          return scoreA - scoreB;
        });
    }
  }, [paramOutbound, paramReturn, selectedStops, selectedAirlines, selectedSort, allAirlines.length, searchCriteria?.tripType]);

  // Hàm xử lý khi nhấn vào thẻ
  const handleFlightSelect = (itinerary: Itinerary) => {
    navigation.navigate('FlightBookingDetails', { 
      outboundFlight: itinerary.outboundFlight,
      returnFlight: itinerary.returnFlight,
      searchCriteria: searchCriteria,
      passengers: passengers
    });
  };

  // Hàm xử lý khi nhấn nút "Sort & Filters"
  const handleOpenFilters = () => {
    // Điều hướng sang màn hình Filter
    navigation.navigate('FlightBookingSearchResults', {
        // Gửi dữ liệu gốc (để tính toán)
        outboundFlights: paramOutbound,
        returnFlights: paramReturn,
        searchCriteria: searchCriteria,
        passengers: passengers,
        allAirlines: allAirlines, // Gửi danh sách hãng bay
        
        // Gửi các bộ lọc hiện tại (để modal biết đang chọn gì)
        currentSort: selectedSort,
        currentStops: selectedStops,
        currentAirlines: selectedAirlines
    });
  };

  // Lấy thông tin Header
  const from = searchCriteria?.from || '...';
  const to = searchCriteria?.to || '...';
  const departDate = searchCriteria?.departDate || 'Date';
  const returnDate = searchCriteria?.returnDate;
  const totalTravellers = (passengers?.adults || 0) + (passengers?.children || 0) + (passengers?.infants || 0) || 1;

  if (!paramOutbound) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BCD4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{from} - {to}</Text>
          <Text style={styles.headerSubtitle}>
            {departDate}{returnDate ? ` - ${returnDate}` : ''}, {totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Thanh Filter (Cuộn ngang) */}
      <ScrollView
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView} // Style cho vùng chứa
        contentContainerStyle={styles.filterContainerContent} // Style cho nội dung bên trong
      >
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleOpenFilters} 
        >
          <MaterialIcons name="tune" size={18} color="#000" />
          <Text style={styles.filterButtonText}>Sort & Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={handleOpenFilters}>
          <Text style={styles.chipButtonText}>{selectedSort}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={handleOpenFilters}>
          <Text style={styles.chipButtonText}>
            {selectedStops === 'Any stops' ? 'Stops' : selectedStops}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={handleOpenFilters}>
          <Text style={styles.chipButtonText}>Time</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Flight List (Dùng FlightCard cặp vé) */}
      <FlatList
        data={itineraries}
        keyExtractor={(item) => item.id}
        style={styles.flightList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        renderItem={({ item }) => (
          <FlightCard
            itinerary={item}
            onPress={handleFlightSelect}
          />
        )}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Ionicons name="airplane-outline" size={64} color="#CCC" />
            <Text style={styles.noResultsTitle}>Không tìm thấy chuyến bay</Text>
            <Text style={styles.noResultsText}>
              Vui lòng thử thay đổi bộ lọc
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// =================================================================
// STYLES
// =================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  backButton: { padding: 8 },
  headerInfo: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  notificationButton: { padding: 8 },
  
  // Styles mới cho thanh Filter
  filterScrollView: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    maxHeight: 60, // Giới hạn chiều cao của thanh
  },
  filterContainerContent: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, // Đệm ngang cho nội dung
    paddingVertical: 10, // Đệm dọc cho nội dung
    gap: 8, 
    alignItems: 'center', 
  },
  filterButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, // Giảm đệm
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    gap: 6 
  },
  filterButtonText: { 
    fontSize: 13, // Giảm cỡ chữ
    color: '#000' 
  },
  chipButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, // Giảm đệm
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8' 
  },
  chipButtonText: { 
    fontSize: 13, // Giảm cỡ chữ
    color: '#000' 
  },

  // Styles cho danh sách
  flightList: { flex: 1 },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40, marginTop: 40 },
  noResultsTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16 },
  noResultsText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});

export default FlightListScreen;