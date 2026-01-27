import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="tabs/dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="tabs/gamesList" options={{ title: "Games List" }} />
      <Tabs.Screen name="tabs/tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="tabs/profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
