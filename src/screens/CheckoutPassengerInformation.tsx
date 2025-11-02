import { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Menu, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";

interface TravellerFormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  countryCode: string;
  phone: string;
}

interface RootStackParamList extends ParamListBase {
  CheckoutPassengerInformation: undefined;
  CheckoutBaggageInformation: undefined;
  CheckoutSeatInformation: undefined;
  CheckoutPayment: undefined;
}

type Props = NativeStackScreenProps<RootStackParamList, "CheckoutPassengerInformation">;

export default function CheckoutPassengerInformation({ navigation }: any) {
  const theme = useTheme();
  const [formData, setFormData] = useState<TravellerFormData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    countryCode: "+07",
    phone: "",
  });

  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [countryCodeMenuVisible, setCountryCodeMenuVisible] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];
  const countryCodes = ["+07", "+1", "+44", "+91", "+86", "+81"];

  const handleInputChange = (field: keyof TravellerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    navigation.navigate("CheckoutSeatInformation");
  };

  const navigateToStep = (step: number) => {
    // Step 1 is current page, so only allow navigation to future steps if form is valid
    if (step === 2) {
      navigation.navigate("CheckoutBaggageInformation");
    } else if (step === 3) {
      navigation.navigate("CheckoutSeatInformation");
    } else if (step === 4) {
      navigation.navigate("CheckoutPayment");
    }
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
            <View style={styles.stepActive}>
              <MaterialCommunityIcons name="account" size={20} color="#fff" />
            </View>
            
            <View style={styles.stepLine} />
            
            <TouchableOpacity onPress={() => navigateToStep(2)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="briefcase" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.stepLine} />
            
            <TouchableOpacity onPress={() => navigateToStep(3)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="sofa" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.stepLine} />
            
            <TouchableOpacity onPress={() => navigateToStep(4)}>
              <View style={styles.stepInactive}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Page title */}
        <Text style={styles.pageTitle}>Traveller information</Text>
      </View>

      {/* Main content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.travellerCount}>Traveller: 1 adult</Text>

        {/* Form inputs */}
        <View style={styles.formSection}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#d1d5db"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor="#06b6d4"
            theme={{ roundness: 8 }}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#d1d5db"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor="#06b6d4"
            theme={{ roundness: 8 }}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Gender</Text>
          <Menu
            visible={genderMenuVisible}
            onDismiss={() => setGenderMenuVisible(false)}
            anchor={
              <TouchableOpacity style={styles.dropdown} onPress={() => setGenderMenuVisible(true)}>
                <Text style={formData.gender ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {formData.gender || "Select option"}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>
            }
          >
            {genderOptions.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  handleInputChange("gender", option);
                  setGenderMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Contact details</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Contact email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email"
            placeholderTextColor="#d1d5db"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor="#06b6d4"
            theme={{ roundness: 8 }}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Contact phone</Text>
          <View style={styles.phoneRow}>
            <Menu
              visible={countryCodeMenuVisible}
              onDismiss={() => setCountryCodeMenuVisible(false)}
              anchor={
                <TouchableOpacity style={styles.countryCodeButton} onPress={() => setCountryCodeMenuVisible(true)}>
                  <Text style={styles.countryCodeText}>{formData.countryCode}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color="#6b7280" />
                </TouchableOpacity>
              }
            >
              {countryCodes.map((code) => (
                <Menu.Item
                  key={code}
                  onPress={() => {
                    handleInputChange("countryCode", code);
                    setCountryCodeMenuVisible(false);
                  }}
                  title={code}
                />
              ))}
            </Menu>

            <TextInput
              style={styles.phoneInput}
              placeholder=""
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#06b6d4"
              theme={{ roundness: 8 }}
            />
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
  travellerCount: { 
    fontSize: 19, 
    color: "#6b7280",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 19,
    fontWeight: "700",
    color: "#535863ff",
    marginBottom: 8,
  },
  input: { 
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#111827",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  dropdownTextPlaceholder: { 
    color: "#d1d5db", 
    fontSize: 15,
  },
  dropdownTextSelected: { 
    color: "#111827", 
    fontSize: 15,
  },
  divider: { 
    height: 1, 
    backgroundColor: "#f3f4f6",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#6b7280",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  phoneRow: { 
    flexDirection: "row", 
    gap: 10,
  },
  countryCodeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minWidth: 90,
    backgroundColor: "#fff",
  },
  countryCodeText: { 
    fontSize: 15, 
    color: "#111827",
    fontWeight: "500",
  },
  phoneInput: { 
    flex: 1, 
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#111827",
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