import Logout from "@/features/auth/Logout";
import ReminderScreen from "@/features/reminders/RemindersScreen";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ReminderScreen />
      </View>
      <Logout />
    </SafeAreaView>
  );
}
