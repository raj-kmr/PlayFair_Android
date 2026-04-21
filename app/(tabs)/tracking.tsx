import AnalyticsScreen from "@/features/tracking/AnalyticsScreen";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export const tracking = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: "#1e293b",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#334155"
          }}>
            <MaterialIcons name="insights" size={24} color="#a78bfa" />
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#f1f5f9" }}>
              Analytics
            </Text>
            <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
              Track your productivity
            </Text>
          </View>
        </View>

        <AnalyticsScreen />
      </ScrollView>
    </SafeAreaView>
  );
};

export default tracking;
