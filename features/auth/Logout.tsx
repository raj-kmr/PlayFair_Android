import { View, Text, Pressable } from "react-native";
import { useAuth } from "./AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

export const Logout = () => {
  const { logout } = useAuth();

  return (
    <Pressable
      onPress={logout}
      className="bg-slate-900/80 border border-slate-700 rounded-xl py-4 active:bg-slate-800"
    >
      <View className="flex-row items-center justify-center gap-2">
        <MaterialIcons name="logout" size={20} color="#f87171" />
        <Text className="text-red-400 text-base font-semibold">
          Logout
        </Text>
      </View>
    </Pressable>
  );
};

export default Logout;