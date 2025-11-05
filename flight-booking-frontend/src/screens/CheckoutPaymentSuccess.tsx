import { View, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CheckoutPaymentSuccess({ navigation, route }: any) {
  const { 
    bookingId = "BK123456",
    departure = "LCY",
    arrival = "JFK",
    departDate = "Tue, Jul 14",
    returnDate = "Fri, Jul 17",
    traveller = "Pedro Moreno",
    flightClass = "Economy",
    tripType = "Round-trip",
    totalPrice = "811.56"
  } = route?.params || {};

  const handleBookingDetail = () => {
    // Navigate to booking detail page
    // navigation.navigate("BookingDetails", { bookingId });
    console.log("View booking details:", bookingId);
  };

  const handleHome = () => {
    // Navigate to home screen
    navigation.navigate("HomeMain");
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800' }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.card}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="check" size={40} color="#f97316" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Booking successful</Text>

            {/* Flight Info */}
            <View style={styles.flightInfo}>
              <View style={styles.flightLocation}>
                <Text style={styles.airportCode}>{departure}</Text>
                <Text style={styles.dateText}>{departDate}</Text>
              </View>

              <View style={styles.flightArrow}>
                <MaterialCommunityIcons name="airplane" size={20} color="#6b7280" />
                <MaterialCommunityIcons name="swap-horizontal" size={24} color="#6b7280" />
              </View>

              <View style={styles.flightLocation}>
                <Text style={styles.airportCode}>{arrival}</Text>
                <Text style={styles.dateText}>{returnDate}</Text>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
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

            {/* Price */}
            <Text style={styles.price}>${totalPrice}</Text>

            {/* Buttons */}
            <Button
              mode="contained"
              onPress={handleBookingDetail}
              style={styles.detailButton}
              labelStyle={styles.detailButtonLabel}
              buttonColor="#06b6d4"
            >
              Booking detail
            </Button>

            <Button
              mode="text"
              onPress={handleHome}
              style={styles.homeButton}
              labelStyle={styles.homeButtonLabel}
            >
              Home
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff7ed',
    borderWidth: 3,
    borderColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
  },
  flightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  flightLocation: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  flightArrow: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
  },
  detailButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  detailButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    width: '100%',
  },
  homeButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#06b6d4',
  },
});