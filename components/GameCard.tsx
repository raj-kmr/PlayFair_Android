import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";


// Represents the UI shape of a single Game item.
// This is intentionally lightweight and UI-focused

export type GameCardItem = {
  id: string | number; // ID can be string or number (future-proof)
  name: string;
  image?: string | null; // optional Image
  playtime_hours?: number | string | null; // value comes from backend in hours
};

/*
* Props for Gamecard 
* onDelete is optional because: 
* - sometimes we may render card without delete funtionality 
*  rightslot allows full customization (edit, button, arrow, etc.)
*/
type Props = {
  item: GameCardItem;
  onDelete?: (id: GameCardItem["id"]) => void;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
};

function formatPlaytime(hours?: number | string | null) {
  const h = Number(hours || 0);

  const totalMinutes = Math.round(h * 60);

  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;

  const mm = String(minutesPart).padStart(2, "0");

  return `${hoursPart}h ${mm}m`;
}

export default function GameCard({ item, onDelete, rightSlot, onPress }: Props) {
  return (
    <Pressable style={[styles.card, !onPress && {opacity: 0.1}] } onPress={onPress} disabled={!onPress}>
      {/* Game cover */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceHolder}></View>
      )}
      <View style={styles.cardBody}>
        {/* Game name */}
        <Text style={styles.gameName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Playtime Display */}
        <Text style={styles.meta} numberOfLines={1}>
          {`Playtime: ${formatPlaytime(item.playtime_hours)}`}
        </Text>

            {/* Action area (Delete or custom slot) */}
        <View style={styles.actions}>
            {
              rightSlot ? (
                rightSlot
              ) : onDelete ? (
                <Pressable onPress={() => onDelete(item.id)} style={styles.iconBtn}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              ) : null
            }
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 12,
  },
  coverPlaceHolder: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardBody: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    opacity: 0.75,
  },
  actions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteText: {
    fontSize: 18,
  },
});
