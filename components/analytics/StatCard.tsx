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
            color="#34d399"
            style={{ marginLeft: 4 }}
          />
        )}
        {trend === "down" && (
          <Ionicons
            name="trending-down"
            size={16}
            color="#f87171"
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
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#334155",
    flex: 1,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f1f5f9",
  },

  label: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 5,
  },
});
