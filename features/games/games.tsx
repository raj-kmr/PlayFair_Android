import { View, Text, FlatList, StyleSheet } from "react-native";
import GameCard from "../../components/GameCard";

const MOCK_GAMES = [
  {
    id: 1,
    name: "Crab Treasure",
    image: null,
    playtime_hours: 2.5,
  },
  {
    id: 2,
    name: "Elden Ring",
    image: null,
    playtime_hours: 12,
  },
];

export default function GamesScreen() {
  const totalPlaytime = MOCK_GAMES.reduce(
    (sum, game) => sum + game.playtime_hours,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 My Games</Text>
      <Text style={styles.total}>
        Total Playtime: {totalPlaytime} hrs
      </Text>

      <FlatList
        data={MOCK_GAMES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onEdit={() => console.log("Edit", item.id)}
            onDelete={() => console.log("Delete", item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  total: {
    color: "#aaa",
    marginVertical: 8,
  },
});
