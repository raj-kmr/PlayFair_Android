import AnalyticsScreen from "@/features/tracking/AnalyticsScreen";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const tracking = () => {
  return (
      <ScrollView style={{flex: 1, backgroundColor: "#fff", marginTop: 20}} contentContainerStyle={styles.container}>
        <Text className=" bg-red-900" style={styles.title}>Work and Game Time Tracking</Text>
        <AnalyticsScreen />
      </ScrollView>
  );
};

export default tracking;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginBottom: 10,
  },
});
