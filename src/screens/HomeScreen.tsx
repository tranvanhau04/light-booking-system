import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ButtonPrimary from "../components/ButtonPrimary";
import { spacing } from "../styles/spacing";
import { colors } from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const nav = useNavigation<HomeScreenNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find your next flight</Text>
        <Text style={styles.subtitle}>Best deals for students & travelers</Text>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <ButtonPrimary
          title="Search flights"
          onPress={() => nav.navigate("Search")}
        />
      </View>

      <View style={styles.cardExample}>
        <Text style={{ fontWeight: "700", marginBottom: 6 }}>
          Top destination
        </Text>
        <Text style={{ color: colors.muted }}>Hanoi → Ho Chi Minh</Text>
      </View>

      <TouchableOpacity
        style={styles.footer}
        onPress={() => alert("Open menu")}
      >
        <Text style={{ color: colors.muted }}>Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { marginTop: 8 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { color: "#64748b", marginTop: 6 },
  cardExample: {
    marginTop: spacing.md,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef2f6",
  },
  footer: { alignItems: "center", padding: 14 },
});
