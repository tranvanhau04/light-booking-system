import { useState, useEffect, useMemo } from 'react'; // <-- THÊM useEffect, useMemo
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, // <-- THÊM
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext'; // <-- IMPORT HOOK
import {
  flightService,
  BackendFlight,
  SeatMapItem,
} from '../services/flightService'; // <-- IMPORT SERVICE

// Interface 'Seat' của bạn (Giữ nguyên)
type SeatStatus = 'available' | 'unavailable' | 'selected';
interface Seat {
  row: number;
  column: string;
  status: SeatStatus;
  price: number;
  cabinId: string; // <-- Thêm cabinId để biết thuộc hạng vé nào
}

export default function CheckoutSelectSeats({ navigation, route }: any) {
  const { setSelectedSeatsData } = useBooking(); // <-- LẤY HÀM SET
  // Giả định bạn nhận được flightId và cabinId từ màn hình trước
  // Ví dụ: { flightId: 'FL001', cabinId: 'C01' }
  const { flightId, cabinId } = route?.params;

  // === 1. STATE MỚI ĐỂ GỌI API ===
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]); // Khởi tạo mảng rỗng

  // === 2. GỌI API BẰNG useEffect ===
  useEffect(() => {
    if (!flightId || !cabinId) {
      setError('Không có thông tin chuyến bay.');
      setLoading(false);
      return;
    }

    const fetchFlightData = async () => {
      try {
        setLoading(true);
        // 1. Gọi API để lấy toàn bộ chi tiết chuyến bay
        const flightData = await flightService.getFlightDetails(flightId);

        // 2. Tìm đúng hạng vé (cabin class) mà người dùng chọn
        const cabin = flightData.flightCabinClasses?.find(
          (c) => c.cabinId === cabinId
        );

        if (!cabin || !cabin.seatMap) {
          throw new Error('Không tìm thấy sơ đồ ghế cho hạng vé này.');
        }

        // 3. "Biến đổi" (Transform) seatMap từ API thành mảng Seat[]
        const initialSeats = cabin.seatMap.map((apiSeat: SeatMapItem) => {
          // Parse "1A" thành row: 1, column: "A"
          const match = apiSeat.seatNumber.match(/^(\d+)([A-Z])$/);
          if (!match) return null; // Bỏ qua nếu ghế không đúng định dạng

          const row = parseInt(match[1]);
          const col = match[2];
          const status = apiSeat.isAvailable ? 'available' : 'unavailable';
          
          // Dùng giá từ API, nếu không có thì dùng logic giá cũ
          const price = apiSeat.price ?? (['D', 'E'].includes(col) ? 10 : 5);

          return {
            row,
            column: col,
            status,
            price,
            cabinId: cabin.cabinId, // Lưu lại cabinId
          };
        }).filter(Boolean) as Seat[]; // Lọc bỏ các ghế bị null

        setSeats(initialSeats);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Lỗi khi tải sơ đồ ghế'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [flightId, cabinId]); // Chạy lại nếu 2 giá trị này thay đổi

  // === 3. LOGIC CŨ (Không cần thay đổi nhiều) ===

  // Tối ưu hóa tính toán bằng useMemo
  const { selectedSeats, totalPrice } = useMemo(() => {
    const selected = seats.filter((s) => s.status === 'selected');
    const price = selected.reduce((sum, seat) => sum + seat.price, 0);
    return { selectedSeats: selected, totalPrice: price };
  }, [seats]);

  const handleSeatPress = (row: number, column: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.row === row && seat.column === column) {
          if (seat.status === 'unavailable') return seat;
          return {
            ...seat,
            status: seat.status === 'selected' ? 'available' : 'selected',
          };
        }
        return seat;
      })
    );
  };

  const getSeatByPosition = (row: number, column: string): Seat | undefined => {
    return seats.find((s) => s.row === row && s.column === column);
  };

  const handleSelect = () => {
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }

  // 1. LƯU data ghế đã chọn vào "kho chứa"
  setSelectedSeatsData(selectedSeats); 

  // 2. Chuyển sang màn hình Thanh toán
  navigation.navigate('CheckoutPayment');
};
  
  // === 4. XỬ LÝ TRẠNG THÁI LOADING VÀ ERROR ===
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 20, color: 'red' }}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  // === 5. PHẦN RENDER (Giữ nguyên) ===
  // (Chúng ta cần xác định 'rows' và 'columns' từ data)
  const allRows = Array.from(new Set(seats.map(s => s.row))).sort((a,b) => a-b);
  // Giữ nguyên layout cột 3-3 của bạn
  const columnsLeft = ['A', 'B', 'C'];
  const columnsRight = ['D', 'E', 'F'];

  const renderSeat = (row: number, column: string) => {
    // ... (Toàn bộ hàm renderSeat của bạn giữ nguyên, không cần sửa) ...
    const seat = getSeatByPosition(row, column);
    if (!seat) return <View key={`${row}-${column}`} style={[styles.seat, {borderWidth: 0}]} />; // Chỗ trống

    const seatStyle = [
      styles.seat,
      seat.status === 'selected' && styles.seatSelected,
      seat.status === 'unavailable' && styles.seatUnavailable,
    ];

    if (seat.status === 'unavailable') {
      return (
        <View key={`${row}-${column}`} style={seatStyle}>
          <MaterialCommunityIcons name="close" size={18} color="#9ca3af" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`${row}-${column}`}
        style={seatStyle}
        onPress={() => handleSeatPress(row, column)}
        activeOpacity={0.7}
      >
        {seat.status === 'selected' && (
          <MaterialCommunityIcons name="check" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Giữ nguyên) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route?.params?.flightRoute || 'Select Seat'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Legend (Giữ nguyên) */}
        <View style={styles.legend}>
         {/* ... (Toàn bộ phần legend của bạn giữ nguyên) ... */}
         <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendAvailable]} />
            <Text style={styles.legendText}>Available seat (from $5-$10)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendUnavailable]}>
              <MaterialCommunityIcons name="close" size={14} color="#9ca3af" />
            </View>
            <Text style={styles.legendText}>Unavailable seat</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]}>
              <MaterialCommunityIcons name="check" size={14} color="#fff" />
            </View>
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>

        {/* Seat Map (Sửa lại để dùng 'allRows' động) */}
        <View style={styles.seatMapContainer}>
          <View style={styles.seatMap}>
            {/* Column Labels (Giữ nguyên) */}
            <View style={styles.columnLabels}>
              <View style={styles.rowLabelSpace} />
              {columnsLeft.map((col) => (
                <Text key={col} style={styles.columnLabel}>{col}</Text>
              ))}
              <View style={{ width: 20 }} /> {/* Lối đi giữa */}
              {columnsRight.map((col) => (
                <Text key={col} style={styles.columnLabel}>{col}</Text>
              ))}
            </View>

            {/* Rows (Sửa lại) */}
            {allRows.map((row) => (
              <View key={row} style={styles.row}>
                <Text style={styles.rowNumber}>{row.toString().padStart(2, '0')}</Text>

                {/* Cụm ghế A–C */}
                {columnsLeft.map((column) => renderSeat(row, column))}

                {/* Lối đi giữa */}
                <View style={{ width: 20 }} />

                {/* Cụm ghế D–F */}
                {columnsRight.map((column) => renderSeat(row, column))}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer (Giữ nguyên) */}
      <View style={styles.footer}>
        {/* ... (Toàn bộ phần footer của bạn giữ nguyên) ... */}
        <View style={styles.footerLeft}>
          <Text style={styles.footerTitle}>
            Select seat {selectedSeats.length} of 1
          </Text>
          {selectedSeats.length > 0 && (
            <Text style={styles.footerSubtitle}>
              Seat {selectedSeats.map(s => `${s.row}${s.column}`).join(', ')} - ${totalPrice.toFixed(2)}
            </Text>
          )}
        </View>
        <Button
          mode="contained"
          onPress={handleSelect}
          style={styles.selectButton}
          labelStyle={styles.selectButtonLabel}
          buttonColor="#06b6d4"
          disabled={selectedSeats.length === 0}
        >
          Select
        </Button>
      </View>
    </SafeAreaView>
  );
}

// ... (Toàn bộ 'styles' của bạn giữ nguyên, không cần sửa)
const styles = StyleSheet.create({
// ... Dán toàn bộ styles của bạn vào đây ...
container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  legendAvailable: {
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  legendUnavailable: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  legendSelected: {
    backgroundColor: "#06b6d4",
  },
  legendText: {
    fontSize: 14,
    color: "#6b7280",
  },
  seatMapContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  seatMap: {
    paddingHorizontal: 12,
  },
  columnLabels: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  rowLabelSpace: {
    width: 36,
  },
  columnLabel: {
    width: 48,
    textAlign: "center",
    fontSize: 15,
  fontWeight: "600",
    color: "#6b7280",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  rowNumber: {
    width: 36,
    fontSize: 15,
    fontWeight: "500",
    color: "#6b7280",
   },
  seat: {
    width: 44,
    height: 44,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  seatSelected: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  seatUnavailable: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerLeft: {
    flex: 1,
    marginRight: 16,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  selectButton: {
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  selectButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});