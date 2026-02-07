import { Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store"

export default function TabLayout() {
  
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="gamesList" options={{ title: "Games List" }} />
      <Tabs.Screen name="tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
