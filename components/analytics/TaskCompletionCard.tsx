import { StyleSheet, Text, View } from "react-native";

export default function TaskCompletionCard({
  percentage,
}: {
  percentage: number;
}) {
  return (
  <View style={styles.container}>
    <Text style={styles.value}>{percentage.toFixed(0)}%</Text>
    <Text style={styles.label}>Task completion</Text>
  </View>
  )}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dfdfdf",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ff99",
  },
  label: {
    color: "#1e1e1e",
    marginTop: 5,
  },
});
