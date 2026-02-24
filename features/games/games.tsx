import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, Image, Pressable } from "react-native";
import GameCard from "../../components/GameCard";
import { useCallback, useEffect, useState } from "react";
import { deleteGame, Game, getGames } from "./games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPlaytime, setTotalPlaytime] = useState<number>(0);

  const loadGame = useCallback(async () => {
    console.log("Calling getGames")
    const data = await getGames();
    setGames(data.games || []);
    setTotalPlaytime(
      typeof data.totalPlaytimeMinutes === "number"
        ? data.totalPlaytimeMinutes
        : typeof data.totalPlaytime === "number"
          ? data.totalPlaytime
          : 0,
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadGame();
      } catch (err) {
        Alert.alert("Error", getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })()
  }, [loadGame]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadGame();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  }, [loadGame]);

  const onDelete = useCallback(
    (id: number) => {
      Alert.alert("Delete Game?", "This will remove the game from your List ", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGame(id);
              await loadGame();
            } catch (err) {
              Alert.alert("Error", getApiErrorMessage(err));
            }
          },
        },
      ]);
    },
    [loadGame],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>My Game</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Games</Text>
      <Text style={styles.subTitle}>Total playtime: {totalPlaytime} min</Text>

      <FlatList
        data={games}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={games.length ? styles.list : styles.emptyWrap}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No games yet. Search and add your first game.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cover} />
            ) : (
              <View style={styles.coverPlaceholder} />
            )}

            <View style={styles.cardBody}>
              <Text style={styles.gameName} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.meta} numberOfLines={1}>
                {typeof item.playtime_hours === "number"
                  ? `Playtime: ${item.playtime_hours} min`
                  : "Playtime: 0 min"}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => onDelete(item.id)}
                  style={styles.iconBtn}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subTitle: { fontSize: 14, opacity: 0.7, marginBottom: 12 },

  list: { paddingBottom: 24 },
  emptyWrap: { flexGrow: 1, justifyContent: "center" },
  emptyText: { textAlign: "center", opacity: 0.7 },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cover: { width: 54, height: 54, borderRadius: 10, marginRight: 12 },
  coverPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardBody: { flex: 1 },
  gameName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 12, opacity: 0.75 },

  actions: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end" },
  iconBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  deleteText: { fontSize: 18 },
});
