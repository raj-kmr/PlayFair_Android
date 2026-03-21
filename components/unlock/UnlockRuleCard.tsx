import { useUnlock } from "@/context/UnlockContext";
import { StyleSheet, Text, View } from "react-native";

export default function UnlockRuleCard() {
  const { rule } = useUnlock();

  if (!rule) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚙️ Unlock Rule</Text>

      <Text style={styles.text}>1 Task = {rule.minutes_per_task} minutes</Text>

      {rule.daily_limit_minutes && (
        <Text style={styles.text}>
          Daily limit: {rule.daily_limit_minutes} minutes
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    marginVertical: 10,
  },
  title: {
    color: "#aaa",
    fontSize: 14,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
