import { View, Text, StyleSheet } from "react-native";

export function GameLoadingView() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>My Game</Text>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
});
