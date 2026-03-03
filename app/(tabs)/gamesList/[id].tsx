import { Game, getGames } from "@/features/games/games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

const normalizeUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

const minutesToHoursText = (minutes?: number | null) => {
  const m =
    typeof minutes === "number" && Number.isFinite(minutes) ? minutes : 0;
  const h = m / 60;
  return h % 1 === 0 ? `${h} hr` : `${h.toFixed(1)} hr`;
};

export default function GameDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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
    })();
  }, [id]);

  const imageUri = useMemo(
    () => normalizeUrl(game?.image ?? null),
    [game?.image],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading....</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Game not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.hero} />
      ) : (
        <View style={styles.heroPlaceholder}></View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{game.name}</Text>

        <Text style={styles.meta}>
          Playtime: {minutesToHoursText(game.playtime_hours)}
        </Text>

        {game.description ? (
          <Text style={styles.desc}>{game.description}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },

  loading: {
    color: "#000",
    opacity: 0.8,
  },

  hero: {
    width: "100%",
    height: 300,
  },

  heroPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
  },

  body: {
    padding: 16,
  },

  title: {
    color: "#000",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },

  meta: {
    color: "#000",
    opacity: 0.7,
    marginBottom: 12,
  },

  desc: {
    color: "#000",
    opacity: 0.9,
    lineHeight: 20,
  },
});
