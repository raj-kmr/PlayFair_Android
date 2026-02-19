import { Tabs } from "expo-router";

export default function TabLayout() {
  
  return (
    // Created the tabs screen for all of the Screens existing in (tabs) folder
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="gamesList" options={{ title: "Games List" }} />
      <Tabs.Screen name="tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
