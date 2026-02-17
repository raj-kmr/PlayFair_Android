import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';


type Props = {
  game: {
    id: number;
    name: string;
    image: string | null;
    playtime_hours: number;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function GameCard({ game, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      {game.image ? (
        <Image source={{ uri: game.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.info}>
        <View>
          <Text style={styles.name}>{game.name}</Text>
          <Text style={styles.time}>{game.playtime_hours} hrs</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.actionBtn}>
            <Ionicons name="create" size={25} color="#4CAF50"/>
          </Pressable>

          <Pressable onPress={onDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={25} color="#F44336"/>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#e9e9e9",
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  placeholder: {
    width: 150,
    height: 150,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#020202",
  },
  time: {
    fontSize: 17,
    color: "#171616",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 10
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  }, 
  edit: {
    color: "#4ade80",
  },
  delete: {
    color: "#f87171",
  },
});
