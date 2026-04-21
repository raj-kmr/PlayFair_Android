import GameSessionCard from "@/components/GameSessionCard";
import { Game, getGames } from "@/features/games/games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const normalizeUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

function formatPlaytime(hours?: number | string | null) {
  const h = Number(hours || 0);
  const totalMinutes = Math.round(h * 60);
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;
  const mm = String(minutesPart).padStart(2, "0");
  return `${hoursPart}h ${mm}m`;
}

export default function GameDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGame = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      const found =
        (data.games || []).find((g) => String(g.id) === String(id)) || null;
      setGame(found);
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGame();
  }, [id]);

  const imageUri = useMemo(
    () => normalizeUrl(game?.image ?? null),
    [game?.image]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="hourglass-empty" size={32} color="#a78bfa" />
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={32} color="#f87171" />
        <Text style={styles.loadingText}>Game not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Header Image */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.hero} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <MaterialIcons name="sports-esports" size={64} color="#475569" />
          </View>
        )}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Game Info */}
      <View style={styles.body}>
        <Text style={styles.title}>{game.name}</Text>

        <View style={styles.playtimeCard}>
          <MaterialIcons name="timer" size={20} color="#a78bfa" />
          <View>
            <Text style={styles.playtimeLabel}>Total Playtime</Text>
            <Text style={styles.playtimeValue}>{formatPlaytime(game.playtime_hours)}</Text>
          </View>
        </View>

        {/* Session Tracking Card */}
        <GameSessionCard gameId={game.id} onSessionEnded={loadGame} />

        {/* Description */}
        {game.description ? (
          <View style={styles.descriptionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="description" size={18} color="#94a3b8" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.description}>{game.description}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    gap: 12,
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 320,
  },
  hero: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  body: {
    padding: 16,
  },
  title: {
    color: "#f1f5f9",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
  },
  playtimeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  playtimeLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  playtimeValue: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  descriptionCard: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
  },
});
