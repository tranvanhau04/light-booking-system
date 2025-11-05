import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CheckoutPayment({ navigation }: any) {
  const handleCheckout = () => {
    // Navigate to success page with booking details
    navigation.navigate("CheckoutPaymentSuccess", {
      bookingId: "BK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      departure: "LCY",
      arrival: "JFK",
      departDate: "Tue, Jul 14",
      returnDate: "Fri, Jul 17",
      traveller: "Pedro Moreno",
      flightClass: "Economy",
      tripType: "Round-trip",
      totalPrice: "811.56"
    });
  };

  const navigateToStep = (step: number) => {
    if (step === 1) navigation.navigate("CheckoutPassengerInformation");
    if (step === 2) navigation.navigate("CheckoutBaggageInformation");
    if (step === 3) navigation.navigate("CheckoutSeatInformation");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and steps */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          {/* Progress steps */}
          <View style={styles.stepsRow}>
            <TouchableOpacity onPress={() => navigateToStep(1)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.stepLineActive} />
            
            <TouchableOpacity onPress={() => navigateToStep(2)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="briefcase" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.stepLineActive} />
            
            <TouchableOpacity onPress={() => navigateToStep(3)}>
              <View style={styles.stepCompleted}>
                <MaterialCommunityIcons name="sofa" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.stepLineActive} />
            
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="#fff" />
            </View>
          </View>
        </View>

        {/* Page title */}
        <Text style={styles.pageTitle}>Payment</Text>
      </View>

      {/* Main content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          
          <View style={styles.card}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.radioSelected}>
                <View style={styles.radioDot} />
              </View>
              <View style={styles.cardBrand}>
                <View style={styles.mastercardLogo}>
                  <View style={[styles.circle, styles.circleRed]} />
                  <View style={[styles.circle, styles.circleOrange]} />
                </View>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardText}>MasterCard</Text>
                <Text style={styles.cardNumber}>**** 9876</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addCardButton}>
              <MaterialCommunityIcons name="plus" size={20} color="#7c3aed" />
              <Text style={styles.addCardText}>New card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Traveller Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveller details</Text>
          
          <View style={styles.card}>
            <View style={styles.travellerRow}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account" size={24} color="#6b7280" />
              </View>
              <View style={styles.travellerInfo}>
                <Text style={styles.travellerName}>Pedro Moreno</Text>
                <Text style={styles.travellerDetails}>Adult  •  Male</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact details</Text>
          
          <View style={styles.card}>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#6b7280" />
              <Text style={styles.contactText}>pedromoreno@gmail.com</Text>
            </View>
            
            <View style={[styles.contactRow, { marginTop: 16 }]}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#6b7280" />
              <Text style={styles.contactText}>(208) 567-8209</Text>
            </View>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Price Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base fare (1 adult)</Text>
              <Text style={styles.summaryValue}>$786.00</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Checked bag</Text>
              <Text style={styles.summaryValue}>$19.99</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Travel protection</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxes & fees</Text>
              <Text style={styles.summaryValue}>$5.57</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalAmount}>$811.56</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>$811.56</Text>
          <Text style={styles.priceLabel}>1 adult</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          labelStyle={styles.checkoutButtonLabel}
          buttonColor="#06b6d4"
        >
          Checkout
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
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 40,
  },
  stepActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  stepLineActive: {
    width: 24,
    height: 2,
    backgroundColor: "#06b6d4",
    marginHorizontal: 4,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  content: { 
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#06b6d4",
  },
  cardBrand: {
    width: 40,
    height: 28,
    marginRight: 8,
  },
  mastercardLogo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  circleRed: {
    backgroundColor: "#eb001b",
  },
  circleOrange: {
    backgroundColor: "#f79e1b",
    marginLeft: -8,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginRight: 8,
  },
  cardNumber: {
    fontSize: 15,
    color: "#6b7280",
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7c3aed",
  },
  addCardButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  addCardText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#7c3aed",
    marginLeft: 8,
  },
  travellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  travellerInfo: {
    flex: 1,
  },
  travellerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  travellerDetails: {
    fontSize: 13,
    color: "#6b7280",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  summaryDivider: {
    height: 2,
    backgroundColor: "#93c5fd",
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#06b6d4",
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
  price: { 
    fontSize: 24, 
    fontWeight: "700",
    color: "#111827",
  },
  priceLabel: { 
    fontSize: 12, 
    color: "#6b7280",
    marginTop: 2,
  },
  checkoutButton: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 4,
  },
  checkoutButtonLabel: { 
    fontSize: 16, 
    fontWeight: "600",
  },
});