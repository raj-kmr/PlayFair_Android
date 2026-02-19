import Logout from "@/features/auth/Logout";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Logout/>
    </SafeAreaView>
  );
}
