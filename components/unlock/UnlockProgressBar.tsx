import { useUnlock } from "@/context/UnlockContext";
import { StyleSheet, View } from "react-native";

export default function UnlockProgressBar() {
  const { unlockData, rule } = useUnlock();

  if (!unlockData || !rule?.daily_limit_minutes) {
    return null;
  }

  const progress = unlockData.earnedMinutes / rule.daily_limit_minutes;

  return (
    <View  style={styles.container}>
        <View style={[styles.fill, {width: `${progress * 100}%`}]}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  fill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
});
