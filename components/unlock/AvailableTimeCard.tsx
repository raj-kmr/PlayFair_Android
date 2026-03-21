import { useUnlock } from "@/context/UnlockContext";
import { StyleSheet, Text, View } from "react-native";

export default function AvailableTimeCard() {
  const { loading, unlockData } = useUnlock();

  if (loading) return <Text>Loading...</Text>;
  if (!unlockData) return <Text>No Data</Text>;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎮 Available Time</Text>
      <Text style={styles.value}>
        {unlockData.availableMinutes} min
      </Text>

      <Text style={styles.meta}>
        Earned: {unlockData.earnedMinutes} min
      </Text>
      <Text style={styles.meta}>
        Used: {unlockData.usedMinutes} min
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1e1e1e",
    marginVertical: 10,
  },
  title: {
    color: "#aaa",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  meta: {
    color: "#ccc",
    fontSize: 12,
  },
});
