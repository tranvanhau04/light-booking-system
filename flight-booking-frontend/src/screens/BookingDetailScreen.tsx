import React, { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator, // Thêm component xử lý loading
} from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
// Thêm hook để lấy route params
import { useRoute, RouteProp } from "@react-navigation/native"
// === 1. THÊM IMPORT ĐỂ LẤY DỮ LIỆU THẬT ===
import { useBooking } from "../context/BookingContext" // Giả sử đường dẫn này là đúng

// === 2. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES) ===
// (Giữ nguyên các interface)
interface FlightInfo {
  fromAirport: string
  toAirport: string
  departureTime: string
  arrivalTime: string
  airline: string
  flightCode: string
  tripType: string
  cabinClass: string
  seat: string
}

interface PassengerInfo {
  fullName: string
  email: string
  phone: string
  dob: string
  nationality: string
}

interface BaggageInfo {
  type: string
  weight: string
  notes: string
}

interface PaymentInfo {
  paymentId: string
  baseFare: number
  taxesAndFees: number // Đổi tên 'taxes' để bao gồm cả phí ghế
  baggageFees: number
  total: number
  paymentDate: string
  paymentMethod: string
  status: string
}

interface BookingData {
  bookingId: string
  bookingDate: string
  status: string
  flight: FlightInfo
  passenger: PassengerInfo
  baggage: BaggageInfo[]
  payment: PaymentInfo
}

// === 3. ĐỊNH NGHĨA PROPS CHO NAVIGATION & ROUTE ===
interface BookingDetailProps {
  navigation?: {
    goBack?: () => void
    navigate?: (path: string) => void
    popToTop?: () => void // Thêm popToTop để về Home
  }
}

// === 4. HÀM FORMAT TIỀN TỆ ===
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`
}

// === 5. XÓA HÀM fetchBookingFromAPI (Đã bị xóa) ===
// const fetchBookingFromAPI = ...

export default function BookingDetailScreen({ navigation }: BookingDetailProps) {
  // === 6. LẤY BOOKING ID TỪ ROUTE VÀ DATA TỪ CONTEXT ===
  const route = useRoute<RouteProp<{ params: { bookingId: string } }, "params">>()
  const bookingId = route.params?.bookingId || "BK-ERROR"
  const { bookingData } = useBooking() // Lấy dữ liệu thật từ context

  // === 7. KHỞI TẠO STATE ĐỂ LƯU DỮ LIỆU ===
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // === 8. GỌI API KHI COMPONENT MỞ RA ===
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true)

        // === BẮT ĐẦU SỬA ĐỔI: XÂY DỰNG DỮ LIỆU THẬT TỪ CONTEXT ===
        // Giả lập thời gian chờ (để giữ hiệu ứng loading)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu chính từ context
        const outbound = bookingData.outboundFlight
        
        // === SỬA LỖI "DỮ LIỆU KHÔNG ĐẦY ĐỦ" TẠI ĐÂY ===
        // Lấy hành khách đầu tiên (từ 'passengers' KHÔNG PHẢI 'passengersData')
        const passenger = bookingData.passengers?.[0]
        // === KẾT THÚC SỬA LỖI ===
        
        // Lấy ghế của chuyến đi (giả định)
        const outboundSeat = bookingData.selectedSeats?.find(
          (s: any) => s.flightId === outbound?.flightId,
        )

        // Kiểm tra dữ liệu cơ bản
        if (!outbound || !passenger) {
          setError("Dữ liệu booking không đầy đủ.")
          setIsLoading(false)
          return
        }

        // Tính toán chi phí
        const seatCost =
          bookingData.selectedSeats?.reduce(
            (sum: number, s: any) => sum + (s.price || 0),
            0,
          ) || 0
        const bagCost =
          bookingData.selectedBaggage?.reduce(
            (sum: number, b: any) => sum + (b.price || 0),
            0,
          ) || 0
        const baseFare = bookingData.totalPrice || 0 // totalPrice từ context là giá gốc
        const total = baseFare + seatCost + bagCost

        // Biến đổi dữ liệu từ context -> định dạng của màn hình này
        const transformedData: BookingData = {
          bookingId: bookingId, // ID thật từ route
          bookingDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "Paid",
          flight: {
            fromAirport: outbound.departureAirport,
            toAirport: outbound.arrivalAirport,
            departureTime: new Date(outbound.departureTime).toLocaleString("en-US", {
              timeStyle: "short",
              dateStyle: "short",
            }),
            arrivalTime: new Date(outbound.arrivalTime).toLocaleString("en-US", {
              timeStyle: "short",
              dateStyle: "short",
            }),
            airline: outbound.airline, // Đã sửa từ 'airlineName'
            flightCode: outbound.flightCode,
            tripType: bookingData.inboundFlight ? "Round-trip" : "One-way",
            cabinClass: passenger.cabinClass || "Economy",
            seat: outboundSeat ? `${outboundSeat.row}${outboundSeat.column}` : "N/A",
          },
          passenger: {
            fullName: `${passenger.firstName} ${passenger.lastName}`,
            email: passenger.email,
            phone: passenger.phone,
            dob: passenger.dob,
            nationality: passenger.nationality,
          },
          // Chuyển đổi mảng hành lý
          baggage: (bookingData.selectedBaggage || []).map((b: any) => ({
            type: b.type === "carryOn" ? "Hand Luggage" : "Checked Baggage",
            weight: `${b.weight} kg`,
            notes: b.price === 0 ? "Free" : formatCurrency(b.price),
          })),
          payment: {
            paymentId: `PMT-${bookingId.substring(2)}`, // Tạo ID thanh toán
            baseFare: baseFare,
            taxesAndFees: seatCost, // Tạm dùng taxes cho phí ghế
            baggageFees: bagCost,
            total: total,
            paymentDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            paymentMethod: "Credit Card", // Giả định
            status: "Paid",
          },
        }

        setBooking(transformedData)
        // === KẾT THÚC SỬA ĐỔI ===
      } catch (err) {
        console.error(err) // Log lỗi thật
        setError("Không thể xử lý chi tiết booking.")
      } finally {
        setIsLoading(false)
      }
    }

    // Kiểm tra xem context đã sẵn sàng chưa
    if (bookingData && bookingData.outboundFlight) {
      loadBookingData()
    } else {
      // Nếu context rỗng (ví dụ: reload app), báo lỗi
      setError("Không tìm thấy dữ liệu booking trong phiên làm việc.")
      setIsLoading(false)
    }
  }, [bookingId, bookingData]) // Chạy lại khi bookingId hoặc bookingData thay đổi

  // === 9. SỬA LẠI CÁC HÀM HANDLER ===
  const handleDownloadTicket = () => {
    console.log(`Download ticket for ${bookingId}`)
    // Logic download vé...
  }

  const handleRebookFlight = () => {
    console.log(`Rebook flight for ${bookingId}`)
    // Điều hướng đến màn hình tìm chuyến bay
    navigation?.navigate?.("FlightSearch")
  }

  const handleBackToHome = () => {
    // Quay về màn hình đầu tiên trong stack (Thường là Home)
    navigation?.popToTop?.()
  }

  // === 10. XỬ LÝ TRẠNG THÁI LOADING / ERROR ===
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066ff" />
          <Text style={styles.loadingText}>Loading Booking Details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || "Booking not found."}</Text>
          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton, { marginTop: 20 }]}
            onPress={handleBackToHome}
          >
            <MaterialIcons name="home" size={20} color="#666" />
            <Text style={styles.tertiaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // === 11. RENDER DỮ LIỆU ĐỘNG (Phần JSX giữ nguyên cấu trúc) ===
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.header.backgroundColor} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack?.()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <MaterialCommunityIcons name="airplane" size={28} color="#0066ff" />
            <Text style={styles.headerText}>Booking Details</Text>
          </View>
        </View>
        <Text style={styles.bookingId}>{booking.bookingId}</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Booking ID</Text>
              <Text style={styles.value}>{booking.bookingId}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Booking Date</Text>
              <Text style={styles.value}>{booking.bookingDate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
               <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Flight Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flight Information</Text>

          {/* Route */}
          <View style={styles.routeContainer}>
            <View style={styles.routeItem}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.routeCode}>{booking.flight.fromAirport}</Text>
              <Text style={styles.routeTime}>{booking.flight.departureTime}</Text>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.routeCode}>{booking.flight.toAirport}</Text>
             <Text style={styles.routeTime}>{booking.flight.arrivalTime}</Text>
            </View>
          </View>

          {/* Flight Details */}
          <View style={styles.divider} />
          <View style={styles.flightDetailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="airplane" size={20} color="#0066ff" />
              <View style={styles.detailContent}>
                <Text style={styles.label}>Airline</Text>
               <Text style={styles.detailValue}>{booking.flight.airline}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="airplane" size={20} color="#0066ff" />
              <View style={styles.detailContent}>
                <Text style={styles.label}>Flight Code</Text>
                <Text style={styles.detailValue}>{booking.flight.flightCode}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color="#0066ff" />
              <View style={styles.detailContent}>
                <Text style={styles.label}>Trip Type</Text>
                <Text style={styles.detailValue}>{booking.flight.tripType}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="package" size={20} color="#0066ff" />
              <View style={styles.detailContent}>
                <Text style={styles.label}>Cabin Class</Text>
               <Text style={styles.detailValue}>{booking.flight.cabinClass}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="package" size={20} color="#0066ff" />
              <View style={styles.detailContent}>
                <Text style={styles.label}>Seat</Text>               
                <Text style={styles.detailValue}>{booking.flight.seat}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Passenger Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Passenger Information</Text>
          <View style={styles.passengerContainer}>
            <View style={styles.passengerRow}>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarText}>
                  {booking.passenger.fullName.charAt(0)}
              </Text>
              </View>
              <View style={styles.passengerInfo}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.detailValue}>{booking.passenger.fullName}</Text>
              </View>
            </View>
            <View style={styles.passengerRow}>
              <MaterialIcons name="email" size={20} color="#0066ff" />
              <View style={styles.passengerInfo}>
               <Text style={styles.label}>Email</Text>
                <Text style={styles.detailValue}>{booking.passenger.email}</Text>
              </View>
            </View>
            <View style={styles.passengerRow}>
              <MaterialIcons name="phone" size={20} color="#0066ff" />
              <View style={styles.passengerInfo}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.detailValue}>{booking.passenger.phone}</Text>
              </View>
            </View>
            <View style={styles.passengerRow}>
              <MaterialIcons name="cake" size={20} color="#0066ff" />
              <View style={styles.passengerInfo}>
                <Text style={styles.label}>Date of Birth</Text>
                <Text style={styles.detailValue}>{booking.passenger.dob}</Text>
              </View>
            </View>
            <View style={styles.passengerRow}>
          <MaterialCommunityIcons name="flag" size={20} color="#0066ff" />
              <View style={styles.passengerInfo}>
                <Text style={styles.label}>Nationality</Text>
                <Text style={styles.detailValue}>{booking.passenger.nationality}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Baggage Information Card */}
        <View style={styles.card}>
      <Text style={styles.cardTitle}>Baggage Information</Text>
          <View style={styles.baggageTable}>
            <View style={styles.baggageHeader}>
              <Text style={[styles.baggageHeaderText, { flex: 2 }]}>Type</Text>
              <Text style={[styles.baggageHeaderText, { flex: 1 }]}>Weight</Text>
              <Text style={[styles.baggageHeaderText, { flex: 1 }]}>Notes</Text>
            </View>
            {/* Map qua mảng baggage */}
            {booking.baggage.map((item, index) => (
              <View style={styles.baggageRow} key={index}>
                <Text style={[styles.baggageCell, { flex: 2 }]}>{item.type}</Text>
                <Text style={[styles.baggageCell, { flex: 1 }]}>{item.weight}</Text>
              <Text
                  style={[
                    styles.baggageCell,
                item.notes === "Free" && styles.baggageFree,
                    { flex: 1 },
                  ]}
                >
                  {item.notes}
            </Text>
              </View>
            ))}
          </View>
          {/* Hiển thị phí extra baggage nếu có */}
        {booking.payment.baggageFees > 0 && (
            <View style={styles.extraBaggageBox}>
              <Text style={styles.extraBaggageText}>
                + Extra baggage ({formatCurrency(booking.payment.baggageFees)})
              </Text>
            </View>
          )}
        </View>

        {/* Payment Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment ID</Text>
              <Text style={styles.detailValue}>{booking.payment.paymentId}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Base Fare</Text>
            <Text style={styles.detailValue}>
                {formatCurrency(booking.payment.baseFare)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Taxes & Fees (Seats)</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(booking.payment.taxesAndFees)}
             </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Baggage Fees</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(booking.payment.baggageFees)}
        </Text>
            </View>
            <View style={[styles.divider, { marginVertical: 12 }]} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(booking.payment.total)}
          </Text>
            </View>
            <View style={[styles.divider, { marginVertical: 12 }]} />
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment Date</Text>
              <Text style={styles.detailValue}>{booking.payment.paymentDate}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.detailValue}>{booking.payment.paymentMethod}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment Status</Text>
            <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{booking.payment.status}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
           onPress={handleDownloadTicket}
          >
            <MaterialIcons name="download" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Download Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
          onPress={handleRebookFlight}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#0066ff" />
            <Text style={styles.secondaryButtonText}>Rebook Flight</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
          onPress={handleBackToHome}
          >
            <MaterialIcons name="home" size={20} color="#666" />
            <Text style={styles.tertiaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }} />
    </ScrollView>
    </SafeAreaView>
  )
}

// === 12. STYLES (Giữ nguyên) ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // Thêm style cho loading/error
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  // Giữ nguyên các styles cũ
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
 },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  	 marginRight: 12,
  },
  headerTitle: {
    flexDirection: "row",
  	 alignItems: "center",
  	 gap: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
  	 color: "#000",
  },
  bookingId: {
    fontSize: 12,
  	 color: "#999",
  	 marginLeft: 40,
  },
  content: {
    flex: 1,
  	 padding: 16,
  },
  card: {
  	 backgroundColor: "#fff",
  	 borderRadius: 12,
  	 padding: 16,
  	 marginBottom: 16,
  	 shadowColor: "#000",
  	 shadowOffset: { width: 0, height: 2 },
  	 shadowOpacity: 0.05,
  	 shadowRadius: 4,
   elevation: 2,
  },
  cardTitle: {
  	 fontSize: 18,
  	 fontWeight: "600",
  	 color: "#000",
  	 marginBottom: 16,
  },
  summaryGrid: {
  	 gap: 12,
  },
  summaryItem: {
  	 paddingVertical: 8,
  },
  label: {
  	 fontSize: 12,
  	 color: "#666",
  	 marginBottom: 4,
  },
  value: {
  	 fontSize: 14,
  	 fontWeight: "500",
  	 color: "#000",
  },
  statusBadge: {
  	 flexDirection: "row",
  	 alignItems: "center",
  	 gap: 6,
  },
  statusDot: {
  	 width: 8,
  	 height: 8,
  	 borderRadius: 4,
  	 backgroundColor: "#22c55e",
},
  statusText: {
  	 fontSize: 14,
  	 fontWeight: "500",
  	 color: "#16a34a",
  },
  routeContainer: {
  	 flexDirection: "row",
  	 gap: 24,
  	 marginBottom: 16,
  },
  routeItem: {
  	 flex: 1,
  },
  routeCode: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#000",
  	 marginTop: 4,
  },
  routeTime: {
  	 fontSize: 12,
  	 color: "#666",
  	 marginTop: 8,
  },
  divider: {
  	 height: 1,
  	 backgroundColor: "#e5e5e5",
  	 marginVertical: 16,
  },
  flightDetailsContainer: {
  	 gap: 12,
  },
  detailRow: {
  	 flexDirection: "row",
  	 alignItems: "flex-start",
  gap: 12,
  },
  detailContent: {
  	 flex: 1,
  },
  detailValue: {
  	 fontSize: 14,
  	 fontWeight: "500",
  	 color: "#000",
  	 marginTop: 2,
  },
  passengerContainer: {
  	 gap: 16,
  },
  passengerRow: {
  	 flexDirection: "row",
  	 alignItems: "flex-start",
  	 gap: 12,
  },
  avatarBadge: {
  	 width: 36,
  	 height: 36,
  	 borderRadius: 18,
  	 backgroundColor: "#dbeafe",
  	 justifyContent: "center",
  	 alignItems: "center",
  },
  avatarText: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#0066ff",
  },
  passengerInfo: {
  	 flex: 1,
  },
  baggageTable: {
  	 marginBottom: 12,
 },
  baggageHeader: {
  	 flexDirection: "row",
  	 backgroundColor: "#f0f0f0",
  	 paddingHorizontal: 12,
  	 paddingVertical: 10,
  	 borderRadius: 6,
  	 marginBottom: 8,
  },
  baggageHeaderText: {
  	 fontSize: 12,
  	 fontWeight: "600",
   color: "#000",
  },
  baggageRow: {
  	 flexDirection: "row",
  	 paddingHorizontal: 12,
  	 paddingVertical: 10,
  	 borderBottomWidth: 1,
  	 borderBottomColor: "#e5e5e5",
  },
  baggageCell: {
  	 fontSize: 13,
  	 color: "#000",
  },
  baggageFree: {
  	 color: "#16a34a",
  	 fontWeight: "500",
 },
  extraBaggageBox: {
  	 backgroundColor: "#dbeafe",
  	 borderRadius: 8,
  	 padding: 12,
  },
  extraBaggageText: {
  	 fontSize: 13,
  	 fontWeight: "500",
  	 color: "#003d7a",
  },
  paymentContainer: {
  	 gap: 8,
  },
  paymentRow: {
  	 flexDirection: "row",
   justifyContent: "space-between",
  	 alignItems: "center",
  },
  totalLabel: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#000",
  },
  totalValue: {
  	 fontSize: 18,
  	 fontWeight: "700",
  	 color: "#0066ff",
  },
  buttonsContainer: {
  	 gap: 12,
  	 marginBottom: 8,
  },
  button: {
  	 flexDirection: "row",
  	 alignItems: "center",
  	 justifyContent: "center",
  	 paddingVertical: 12,
  	 paddingHorizontal: 16,
  	 borderRadius: 8,
  	 gap: 8,
  },
  primaryButton: {
  	 backgroundColor: "#0066ff",
  },
  primaryButtonText: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#fff",
  },
  secondaryButton: {
  	 backgroundColor: "#fff",
  	 borderWidth: 1,
  borderColor: "#b3d9ff",
  },
  secondaryButtonText: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#0066ff",
  },
  tertiaryButton: {
  	 backgroundColor: "#fff",
  	 borderWidth: 1,
  	 borderColor: "#e5e5e5",
  },
  tertiaryButtonText: {
  	 fontSize: 14,
  	 fontWeight: "600",
  	 color: "#666",
  },
})