import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Itinerary, Flight } from '../types/flight'; // <-- SỬA THÀNH DÒNG NÀY

// =================================================================
// ĐỊNH NGHĨA PROPS
// =================================================================
interface FlightCardProps {
    itinerary: Itinerary; // Nhận cả lịch trình
    onPress: (itinerary: Itinerary) => void;
}

// =================================================================
// CÁC HÀM HỖ TRỢ
// =================================================================

// Hàm format thời gian (ví dụ: "2025-11-01T09:30:00.000Z" -> "9:30 AM")
const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    // Dùng hour12: true để có AM/PM
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); 
};

// Hàm format thời gian bay (ví dụ: 570 -> "9h 30m")
const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

// Hàm lấy thông tin điểm dừng
const formatStops = (stopCount: number) => {
    if (stopCount === 0) return 'Direct';
    if (stopCount === 1) return '1 stop';
    return `${stopCount} stops`;
};

// ... (các hàm format khác) ...

// Hàm chọn Icon
const getAirlineIcon = (airline: string) => {
    type IconProps = React.ComponentProps<typeof MaterialCommunityIcons>;
    let iconName: IconProps['name'] = 'airplane';
    let color: string = '#64748b';
    
    // BƯỚC 1: SỬA LỖI TẠI ĐÂY
    // Gán một style mặc định ngay từ đầu
    let style: any = [styles.iconGeneric, { backgroundColor: '#f1f5f9' }];
    // Gán icon mặc định
    iconName = 'airplane-takeoff'; 

    switch (airline) {
        case 'SkyHaven':
            iconName = 'circle-opacity'; 
            color = '#3b82f6';
            style = [styles.iconGeneric, { backgroundColor: '#dbeafe' }];
            break;
        case 'EcoWings':
            iconName = 'moon-waning-crescent';
            color = '#ffffff';
            style = [styles.iconGeneric, { backgroundColor: '#1e293b' }];
            break;
        case 'Lufthansa':
            iconName = 'flash';
            color = '#1e293b';
            style = [styles.iconGeneric, { backgroundColor: '#fcd34d' }];
            break;
        case 'JapanAir':
            iconName = 'alpha-j-circle';
            color = '#dc2626';
            style = [styles.iconGeneric, { backgroundColor: '#fee2e2' }];
            break;
        case 'DeltaAir':
            iconName = 'delta';
            color = '#065a9b';
            style = [styles.iconGeneric, { backgroundColor: '#e0f2fe' }];
            break;
        // Bạn không cần 'default' nữa vì đã có giá trị khởi tạo
    }

    return (
        <View style={style}>
            <MaterialCommunityIcons name={iconName} size={20} color={color} />
        </View>
    );
};

// ... (phần còn lại của code) ...

// =================================================================
// COMPONENT ĐỂ VẼ 1 HÀNG CHUYẾN BAY (MỚI)
// =================================================================
const FlightRow = ({ flight }: { flight: Flight }) => (
    <View style={styles.flightRow}>
        {/* Icon Hãng bay */}
        {getAirlineIcon(flight.airline)}
        
        {/* Thông tin giờ */}
        <View style={styles.timeSection}>
            <Text style={styles.time}>{formatTime(flight.departureTime)}</Text>
            <Text style={styles.airportCode}>{flight.departureAirport.substring(0, 3).toUpperCase()}</Text>
        </View>
        
        <Text style={styles.arrow}>→</Text>

        <View style={styles.timeSection}>
            <Text style={styles.time}>{formatTime(flight.arrivalTime)}</Text>
            <Text style={styles.airportCode}>{flight.arrivalAirport.substring(0, 3).toUpperCase()}</Text>
        </View>
        
        {/* Thông tin hãng và điểm dừng */}
        <View style={styles.detailsSection}>
            <Text style={styles.duration}>{formatDuration(flight.duration)}</Text>
            <Text style={styles.airline}>{flight.airline}</Text>
        </View>

        <View style={styles.stopSection}>
            <Text style={styles.stops}>{formatStops(flight.stopCount)}</Text>
        </View>
    </View>
);

// =================================================================
// COMPONENT CARD CHÍNH (ĐÃ SỬA)
// =================================================================
export default function FlightCard({ itinerary, onPress }: FlightCardProps) {
    const { outboundFlight, returnFlight, totalPrice } = itinerary;

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => onPress?.(itinerary)} 
            activeOpacity={0.8}
        >
            {/* HÀNG CHUYẾN BAY ĐI */}
            <FlightRow flight={outboundFlight} />
            
            {/* Dấu gạch ngang nếu có chuyến về */}
            {returnFlight && <View style={styles.divider} />}

            {/* HÀNG CHUYẾN BAY VỀ (Nếu có) */}
            {returnFlight && (
                <FlightRow flight={returnFlight} />
            )}

            {/* PHẦN GIÁ VÀ YÊU THÍCH */}
            <View style={styles.footer}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="heart-outline" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text style={styles.price}>${totalPrice.toFixed(0)}</Text> 
            </View>
        </TouchableOpacity>
    );
}

// =================================================================
// STYLES MỚI
// =================================================================
const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    flightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 4,
    },
    iconGeneric: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    timeSection: {
        alignItems: 'flex-start',
    },
    time: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    airportCode: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    arrow: {
        marginHorizontal: 10,
        color: '#94a3b8',
    },
    detailsSection: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 10,
    },
    duration: {
        fontSize: 12,
        color: '#64748b',
    },
    airline: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    stopSection: {
        minWidth: 40, // Đảm bảo text "Direct" không bị vỡ
        alignItems: 'flex-end',
    },
    stops: {
        fontSize: 12,
        color: '#64748b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 8,
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
        marginTop: 4,
    },
    price: {
        fontWeight: '800',
        fontSize: 20,
        color: '#1e293b',
    },
});