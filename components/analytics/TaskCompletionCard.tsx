import { StyleSheet, Text, View } from "react-native";

interface Props {
  percentage: number;
  completed?: number;
  total?: number;
  timeRange?: '7d' | '30d';
}

export default function TaskCompletionCard({ percentage, completed, total, timeRange = '7d' }: Props) {
  const timeRangeText = timeRange === '7d' ? 'Last 7 days' : 'Last 30 days';

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{percentage.toFixed(0)}%</Text>
      <Text style={styles.label}>Task completion</Text>
      {total !== undefined && (
        <Text style={styles.subtext}>
          {completed} / {total} tasks ({timeRangeText})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#34d399",
  },
  label: {
    color: "#f1f5f9",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  subtext: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
  },
});
