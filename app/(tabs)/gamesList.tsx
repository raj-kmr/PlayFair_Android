import GamesScreen from "@/features/games/games";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const gamesList = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <GamesScreen />
      </View>
    </SafeAreaView>
  );
};

export default gamesList;
