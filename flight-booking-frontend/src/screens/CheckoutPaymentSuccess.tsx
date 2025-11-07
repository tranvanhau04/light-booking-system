import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

// === 1. THÊM HÀM FORMAT NGÀY ===
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Trả về định dạng: "Tue, Jul 14"
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return dateString; // Trả về nguyên bản nếu lỗi
  }
};

export default function CheckoutPaymentSuccess({ navigation, route }: any) {
  const {
    bookingId = 'BK123456',
    departure = 'LCY',
    arrival = 'JFK',
    departDate, // Bỏ giá trị mặc định
    returnDate, // Bỏ giá trị mặc định
    traveller = 'Pedro Moreno',
    flightClass = 'Economy',
    tripType = 'Round-trip',
    totalPrice = '811.56',
  } = route?.params || {};

  const handleBookingDetail = () => {
    console.log('View booking details:', bookingId);
    // (Bạn có thể điều hướng đến màn hình chi tiết booking ở đây)
  };

  const handleHome = () => {
    // Điều hướng về màn hình Home và reset lại toàn bộ stack
    navigation.popToTop(); // Quay về màn hình đầu tiên trong Stack
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Ảnh nền nửa trên */}
      <Image
        source={require('../../assets/img/plane-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Nội dung chính */}
      <View style={styles.bottomContainer}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={36}
              color="#d97706"
            />
          </View>

          <Text style={styles.title}>Booking successful</Text>

          <View style={styles.flightRow}>
            <View style={styles.flightCol}>
              <Text style={styles.airportCode}>{departure}</Text>
              {/* === 2. SỬ DỤNG HÀM FORMAT === */}
              <Text style={styles.date}>{formatDate(departDate)}</Text>
            </View>

            <MaterialCommunityIcons
              name="swap-horizontal"
              size={22}
              color="#6b7280"
            />

            <View style={styles.flightCol}>
              <Text style={styles.airportCode}>{arrival}</Text>
              {/* === 2. SỬ DỤNG HÀM FORMAT === */}
              <Text style={styles.date}>{formatDate(returnDate)}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Traveller</Text>
              <Text style={styles.detailValue}>{traveller}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Class</Text>
              <Text style={styles.detailValue}>{flightClass}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Flight</Text>
              <Text style={styles.detailValue}>{tripType}</Text>
            </View>
          </View>

          <Text style={styles.price}>${totalPrice}</Text>

          <Button
            mode="contained"
            onPress={handleBookingDetail}
            style={styles.detailButton}
            buttonColor="#06b6d4"
            labelStyle={styles.buttonLabel}
          >
            Booking detail
          </Button>

          <Button mode="text" onPress={handleHome} labelStyle={styles.homeLabel}>
            Home
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ... (Toàn bộ 'styles' của bạn giữ nguyên, không cần sửa)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: height * 0.45,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: height * 0.45,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 22,
  },
  flightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginBottom: 24,
  },
  flightCol: {
    alignItems: "center",
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  date: {
    fontSize: 13,
    color: "#6b7280",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 24,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  detailButton: {
    width: "85%",
    borderRadius: 10,
    marginBottom: 8,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
 },
  homeLabel: {
    color: "#06b6d4",
    fontSize: 15,
    fontWeight: "600",
  },
});