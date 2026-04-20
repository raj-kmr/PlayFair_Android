import { StyleSheet, Text, View } from "react-native";

type Props = {
  completed: number;
  total: number;
  percentage: number;
};

export default function ProgressHeader({
  completed,
  total,
  percentage,
}: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.subtitle}>
          {completed} / {total} habits completed
        </Text>
      </View>

      <View style={styles.percentageWrap}>
        <Text style={styles.percentage}>{percentage}</Text>
        <Text style={styles.percentSign}>%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    marginBottom: 16,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#334155",
    borderWidth: 1,
  },

  title: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },

  percentageWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  percentage: {
    color: "#a78bfa",
    fontSize: 28,
    fontWeight: "800",
  },

  percentSign: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
});
