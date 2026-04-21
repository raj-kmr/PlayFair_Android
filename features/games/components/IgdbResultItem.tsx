import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import type { IgdbGame } from "../hooks/useIgdbSearch";
import { MaterialIcons } from "@expo/vector-icons";

type IgdbResultItemProps = {
  item: IgdbGame;
  onAdd: (item: IgdbGame) => void;
};

export function IgdbResultItem({ item, onAdd }: IgdbResultItemProps) {
  return (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <MaterialIcons name="videogame-asset" size={24} color="#475569" />
        </View>
      )}

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {item.name}
        </Text>
      </View>

      <Pressable onPress={() => onAdd(item)} style={styles.addBtn}>
        <MaterialIcons name="add-circle-outline" size={20} color="#ffffff" />
        <Text style={styles.addText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  coverPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#f1f5f9",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#7c3aed",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addText: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 13,
  },
});
