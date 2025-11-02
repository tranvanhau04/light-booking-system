import { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SeatStatus = 'available' | 'unavailable' | 'selected';

interface Seat {
  row: number;
  column: string;
  status: SeatStatus;
  price: number;
}

export default function CheckoutSelectSeats({ navigation, route }: any) {
  const { flightRoute = "LCY - JFK", flightType = "departure" } = route?.params || {};
  
  // Initialize seats grid
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = 8;
  
  const [seats, setSeats] = useState<Seat[]>(() => {
    const initialSeats: Seat[] = [];
    for (let row = 1; row <= rows; row++) {
      for (const col of columns) {
        // Set specific seats as unavailable to match design
        const unavailableSeats = ['B2', 'B4', 'B5', 'C3', 'C7', 'D1', 'D3', 'D4', 'E1', 'E3', 'E4', 'E5', 'E7', 'F1', 'F3', 'F6'];
        const isUnavailable = unavailableSeats.includes(`${col}${row}`);
        
        // Set seat 3D as selected by default to match design
        const isSelected = col === 'D' && row === 3;
        
        // Price based on column
        const price = ['D', 'E'].includes(col) ? 10 : 5;
        
        initialSeats.push({
          row,
          column: col,
          status: isUnavailable ? 'unavailable' : (isSelected ? 'selected' : 'available'),
          price
        });
      }
    }
    return initialSeats;
  });

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatPress = (row: number, column: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.row === row && seat.column === column) {
        if (seat.status === 'unavailable') return seat;
        return {
          ...seat,
          status: seat.status === 'selected' ? 'available' : 'selected'
        };
      }
      return seat;
    }));
  };

  const getSeatByPosition = (row: number, column: string): Seat | undefined => {
    return seats.find(s => s.row === row && s.column === column);
  };

  const handleSelect = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    // Navigate back to seat information page with selected seats
    navigation.goBack();
  };

  const renderSeat = (row: number, column: string) => {
    const seat = getSeatByPosition(row, column);
    if (!seat) return null;

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{flightRoute}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Legend */}
        <View style={styles.legend}>
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
{/* Seat Map */}
<View style={styles.seatMapContainer}>
  <View style={styles.seatMap}>
    {/* Column Labels */}
    <View style={styles.columnLabels}>
      <View style={styles.rowLabelSpace} />
      {['A', 'B', 'C'].map(col => (
        <Text key={col} style={styles.columnLabel}>{col}</Text>
      ))}
      <View style={{ width: 20 }} /> {/* Lối đi giữa */}
      {['D', 'E', 'F'].map(col => (
        <Text key={col} style={styles.columnLabel}>{col}</Text>
      ))}
    </View>

    {/* Rows */}
    {Array.from({ length: rows }, (_, i) => i + 1).map(row => (
      <View key={row} style={styles.row}>
        <Text style={styles.rowNumber}>{row.toString().padStart(2, '0')}</Text>

        {/* Cụm ghế A–C */}
        {['A', 'B', 'C'].map(column => renderSeat(row, column))}

        {/* Lối đi giữa */}
        <View style={{ width: 20 }} />

        {/* Cụm ghế D–F */}
        {['D', 'E', 'F'].map(column => renderSeat(row, column))}
      </View>
    ))}
  </View>
</View>

<View style={{ height: 120 }} />

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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

const styles = StyleSheet.create({
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
    textAlign: "left",
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