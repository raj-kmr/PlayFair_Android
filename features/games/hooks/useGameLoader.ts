import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { Game, deleteGame, getGames } from "../games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export function useGameLoader() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPlaytime, setTotalPlaytime] = useState<number>(0);

  const loadGame = useCallback(async () => {
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
    (id: number | string) => {
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

  return {
    games,
    loading,
    setLoading,
    refreshing,
    totalPlaytime,
    loadGame,
    onRefresh,
    onDelete,
  };
}
