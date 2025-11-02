import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CheckoutSeatInformation({ navigation }: any) {
  const handleNext = () => {
    navigation.navigate("CheckoutPayment");
  };

  const handleSelectSeats = (flightRoute: string, flightType: string) => {
    navigation.navigate("CheckoutSelectSeats", {
      flightRoute,
      flightType
    });
  };

  const navigateToStep = (step: number) => {
    if (step === 1) navigation.navigate("CheckoutPassengerInformation");
    if (step === 2) navigation.navigate("CheckoutBaggageInformation");
    if (step === 4) navigation.navigate("CheckoutPayment");
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
            
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="seat-passenger" size={20} color="#fff" />
            </View>
            
            <View style={styles.stepLine} />
            
            <TouchableOpacity onPress={() => navigateToStep(4)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Page title */}
        <Text style={styles.pageTitle}>Seat</Text>
      </View>

      {/* Main content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Flight to New York */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight to New York</Text>
          
          <View style={styles.flightCard}>
            <View style={styles.flightLeft}>
              <View style={styles.flightIcon}>
                <MaterialCommunityIcons name="airplane" size={24} color="#6b7280" />
              </View>
              <View>
                <Text style={styles.flightRoute}>LCY - JFK</Text>
                <Text style={styles.flightPrice}>Seats from $5</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => handleSelectSeats("LCY - JFK", "departure")}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flight to London */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight to London</Text>
          
          <View style={styles.flightCard}>
            <View style={styles.flightLeft}>
              <View style={styles.flightIcon}>
                <MaterialCommunityIcons name="airplane" size={24} color="#6b7280" />
              </View>
              <View>
                <Text style={styles.flightRoute}>LCY - JFK</Text>
                <Text style={styles.flightPrice}>Seats from $4.59</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => handleSelectSeats("LCY - JFK", "return")}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons name="information" size={20} color="#fff" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Seat selection is optional</Text>
            <Text style={styles.infoText}>
              If you don't select a seat now, one will be randomly assigned to you at check-in.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>$806</Text>
          <Text style={styles.priceLabel}>1 adult</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          labelStyle={styles.nextButtonLabel}
          buttonColor="#06b6d4"
        >
          Next
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
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  flightLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flightIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flightRoute: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  flightPrice: {
    fontSize: 13,
    color: "#6b7280",
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7c3aed",
  },
  infoBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#93c5fd",
    flexDirection: "row",
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
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
  nextButton: {
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  nextButtonLabel: { 
    fontSize: 16, 
    fontWeight: "600",
  },
});