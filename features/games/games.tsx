import { View, StyleSheet, Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import GameList from "@/components/GameList";
import AddGameCard from "@/components/AddGameCard";
import { router, useFocusEffect } from "expo-router";
import { useGameLoader } from "./hooks/useGameLoader";
import { useIgdbSearch } from "./hooks/useIgdbSearch";
import { GameLoadingView } from "./components/GameLoadingView";
import { IgdbSearchBar } from "./components/IgdbSearchBar";
import { IgdbSearchResults } from "./components/IgdbSearchResults";
import { AddGameModal } from "./components/AddGameModal";
import { AddIgdbGameModal } from "./components/AddIgdbGameModal";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export default function GamesScreen() {
  const {
    games,
    loading,
    setLoading,
    refreshing,
    loadGame,
    onRefresh,
    onDelete,
  } = useGameLoader();

  const [addOpen, setAddOpen] = useState(false);

  const igdb = useIgdbSearch(() => loadGame());

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
    })();
  }, [loadGame]);

  useFocusEffect(
    useCallback(() => {
      void loadGame();
    }, [loadGame]),
  );

  const openAddModal = useCallback(() => {
    setAddOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setAddOpen(false);
  }, []);

  if (loading) {
    return <GameLoadingView />;
  }

  return (
    <View style={{ flex: 1 }}>
      <IgdbSearchBar
        value={igdb.searchText}
        onChangeText={igdb.setSearchText}
        searching={igdb.searching}
        hasResults={igdb.igdbResults.length > 0}
      />

      <IgdbSearchResults
        data={igdb.igdbResults}
        onAddPress={igdb.openIgdbAddFlow}
        visible={igdb.q.length >= 2}
      />

      <AddIgdbGameModal
        visible={igdb.addIgdbOpen}
        game={igdb.selectedIgdb}
        onClose={igdb.closeIgdbAddFlow}
        onConfirm={igdb.onConfirmAddIgdb}
        playedBefore={igdb.playedBefore}
        setPlayedBefore={igdb.setPlayedBefore}
        playedHoursInput={igdb.playedHoursInput}
        setPlayedHoursInput={igdb.setPlayedHoursInput}
        adding={igdb.addIgdb}
      />

      <AddGameModal
        visible={addOpen}
        onClose={closeAddModal}
        onSaved={loadGame}
      />

      <GameList
        games={games}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDelete={onDelete}
        onPressItem={(item) =>
          router.push({
            pathname: "/(tabs)/gamesList/[id]",
            params: { id: String(item.id) },
          })
        }
      />

      <View style={styles.fabWrap}>
        <AddGameCard onPress={openAddModal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    position: "absolute",
    right: 18,
    bottom: 18,
  },
});
