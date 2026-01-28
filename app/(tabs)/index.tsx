import { Text, View } from "react-native";

export function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Playfair App</Text>
    </View>
  );
}

export default function Dashboard() {
  return (
    <View>
      <Text>This is Dashboard</Text>
    </View>
  );
}
