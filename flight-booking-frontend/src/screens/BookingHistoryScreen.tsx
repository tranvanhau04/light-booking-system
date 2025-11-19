import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';

const BookingHistoryScreen = ({ navigation, route }: any) => {
  const { type } = route.params || { type: 'history' };
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    // === SỬA LỖI TẠI ĐÂY: DÙNG ĐÚNG ID TRONG DATABASE ===
    // Trong file SQL, ID là 'USR001', không phải 'U001'
    const userId = 'USR001'; 
    
    // Code thật (sau khi test xong thì mở lại):
    // const userId = user?.userId || (user as any)?.id || (user as any)?.account?.accountId;

    console.log('--- BẮT ĐẦU LẤY DỮ LIỆU ---');
    console.log('Đang lấy booking cho User ID:', userId);

    if (!userId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const data = await bookingService.getUserBookings(userId);
      console.log('Dữ liệu gốc từ API:', JSON.stringify(data, null, 2));

      const formattedData = data.map((item: any) => {
        // Kiểm tra kỹ cấu trúc trả về của Sequelize
        // Sequelize thường trả về 'flights' (số nhiều) hoặc 'Flights' tùy cấu hình
        const flightList = item.flights || item.Flights || [];
        const flight = flightList[0] || {}; 
        
        return {
          id: item.bookingId,
          flightNumber: flight.flightCode || flight.flightNumber || 'N/A', 
          airline: flight.airline || 'Unknown',
          from: flight.departureAirport || '---',
          to: flight.arrivalAirport || '---',    
          // Ưu tiên ngày bay, nếu không có thì lấy ngày đặt
          date: flight.departureTime || item.bookingDate, 
          status: item.status || 'Confirmed',
          price: item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') + ' VND' : '0 VND',
          duration: flight.duration ? `${flight.duration}m` : '--',
          raw: item 
        };
      });

      console.log('Dữ liệu sau khi format:', formattedData);

      const now = new Date();
      let filtered = [];
      
      if (type === 'upcoming') {
        filtered = formattedData.filter((item: any) => {
            // Chuyển đổi ngày an toàn
            const flightDate = new Date(item.date);
            return flightDate >= now;
        });
        filtered.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        // History lấy tất cả
        filtered = formattedData;
        // Sắp xếp giảm dần (mới nhất lên đầu)
        filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      
      console.log(`Dữ liệu sau khi lọc (${type}):`, filtered.length);
      setBookings(filtered);

    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      console.log('Chi tiết lỗi:', error.response?.data);
      if (!refreshing) Alert.alert('Lỗi', 'Không thể tải lịch sử đặt vé.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, [type]); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [type]);

  const renderBookingItem = ({ item }: { item: any }) => {
    const dateObj = new Date(item.date);
    const dateStr = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    let statusColor = '#4CAF50'; 
    const statusLower = (item.status || '').toLowerCase();
    if (statusLower === 'cancelled') statusColor = '#F44336';
    else if (statusLower === 'pending') statusColor = '#FF9800';
    
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => Alert.alert('Info', `ID: ${item.id}`)}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={16} color="#666" />
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.routeRow}>
            <View style={styles.cityContainer}>
              <Text style={styles.cityCode}>{item.from}</Text>
              <Text style={styles.timeText}>{timeStr}</Text>
            </View>
            <View style={styles.flightPath}>
              <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#00BCD4" />
              <View style={styles.dottedLine} /><Text style={styles.durationText}>{item.duration}</Text><View style={styles.dottedLine} />
              <MaterialCommunityIcons name="map-marker" size={20} color="#00BCD4" />
            </View>
            <View style={styles.cityContainer}>
              <Text style={styles.cityCode}>{item.to}</Text>
              <Text style={styles.timeText}>--:--</Text>
            </View>
          </View>
          <View style={styles.airlineRow}>
            <MaterialCommunityIcons name="airplane" size={16} color="#999" />
            <Text style={styles.airlineText}>{item.airline} • {item.flightNumber}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>{item.price}</Text>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Chi tiết</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#00BCD4" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type === 'upcoming' ? 'Chuyến bay sắp tới' : 'Lịch sử đặt vé'}</Text>
        <View style={{ width: 24 }} /> 
      </View>
      {loading && !refreshing ? (
        <View style={styles.centerContainer}><ActivityIndicator size="large" color="#00BCD4" /></View>
      ) : (
        <FlatList data={bookings} keyExtractor={(item) => item.id} renderItem={renderBookingItem} 
          contentContainerStyle={styles.listContent} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00BCD4']} />} 
          ListEmptyComponent={<View style={styles.centerContainer}><Text style={styles.emptyText}>Không có dữ liệu</Text></View>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, elevation: 3, padding: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: '#666' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontWeight: 'bold', fontSize: 12 },
  cardBody: { padding: 16 },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cityContainer: { alignItems: 'center', width: 60 },
  cityCode: { fontSize: 20, fontWeight: 'bold' },
  timeText: { fontSize: 12, color: '#999' },
  flightPath: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  dottedLine: { flex: 1, height: 1, backgroundColor: '#ccc', marginHorizontal: 4 },
  durationText: { fontSize: 10, backgroundColor: '#f0f0f0', padding: 4, borderRadius: 4 },
  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  airlineText: { color: '#666' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#fafafa', borderTopWidth: 1, borderColor: '#eee' },
  priceText: { fontWeight: 'bold', color: '#FF9800', fontSize: 16 },
  detailButton: { flexDirection: 'row', alignItems: 'center' },
  detailButtonText: { color: '#00BCD4', fontWeight: '600' },
  emptyText: { color: '#999' }
});
export default BookingHistoryScreen;