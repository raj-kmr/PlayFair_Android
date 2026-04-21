import { FlatList, Text, View, StyleSheet } from "react-native";
import type { IgdbGame } from "../hooks/useIgdbSearch";
import { IgdbResultItem } from "./IgdbResultItem";
import { MaterialIcons } from "@expo/vector-icons";

type IgdbSearchResultsProps = {
  data: IgdbGame[];
  onAddPress: (item: IgdbGame) => void;
  visible: boolean;
};

export function IgdbSearchResults({
  data,
  onAddPress,
  visible,
}: IgdbSearchResultsProps) {
  if (!visible) return null;

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="search-off" size={32} color="#475569" />
        <Text style={styles.emptyText}>Start typing to search for games</Text>
      </View>
    );
  }

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <MaterialIcons name="search" size={16} color="#94a3b8" />
        <Text style={styles.resultsCount}>{data.length} result{data.length !== 1 ? "s" : ""}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.igdbId)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <IgdbResultItem item={item} onAdd={onAddPress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  resultsCount: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  list: {
    gap: 10,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
  },
});
