import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import type { IgdbGame } from "../hooks/useIgdbSearch";

type IgdbResultItemProps = {
  item: IgdbGame;
  onAdd: (item: IgdbGame) => void;
};

export function IgdbResultItem({ item, onAdd }: IgdbResultItemProps) {
  return (
    <View style={styles.row}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.title}>
          {item.name}
        </Text>
      </View>

      <Pressable onPress={() => onAdd(item)} style={styles.addBtn}>
        <Text style={styles.addText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  title: {
    fontWeight: "600",
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  addText: {
    fontWeight: "700",
    color: "#000",
  },
});
