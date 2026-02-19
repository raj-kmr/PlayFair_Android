import GamesScreen from "@/features/games/games";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const gamesList = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <GamesScreen />
    </SafeAreaView>
  );
};

export default gamesList;
