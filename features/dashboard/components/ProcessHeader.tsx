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

      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  leftSide: {},

  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#000",
    fontSize: 14,
    marginTop: 6,
  },

  percentage: {
    color: "#000",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
  },
});
