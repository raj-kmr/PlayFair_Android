import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  value: string | number | ReactNode;
  trend?: "up" | "down" | null;
}

export default function StatCard({ title, value, trend = null }: Props) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text style={styles.value}>{value}</Text>
        {trend === "up" && (
          <Ionicons
            name="trending-up"
            size={16}
            color="#00C853"
            style={{ marginLeft: 4 }}
          />
        )}
        {trend === "down" && (
          <Ionicons
            name="trending-down"
            size={16}
            color="#ff4444"
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
      <Text style={styles.label}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#dddddd",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  label: {
    fontSize: 12,
    color: "#1e1e1e",
    marginTop: 5,
  },
});
