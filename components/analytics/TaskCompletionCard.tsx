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
  subtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
});
