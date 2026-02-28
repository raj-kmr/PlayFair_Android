import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
  Pressable,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { createGame, deleteGame, Game, getGames } from "./games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import GameList from "@/components/GameList";
import * as ImagePicker from "expo-image-picker";
import AddGameCard from "@/components/AddGameCard";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPlaytime, setTotalPlaytime] = useState<number>(0);

  /*
   * Modal visibility + form fields for creating a new game
   * imageUri is local device URI (preview only). Backend needs a hosted URL.
   */
  const [addOpen, setAddOpen] = useState(false);
  const [gameName, setGameName] = useState("");
  const [hoursInput, setHoursInput] = useState("0");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Prevent double submit while creating a game
  const [creating, setCreating] = useState(false);

  // UI accepts hours, backend stores minutes, so a function to convert
  const convertHoursToMinutes = (hoursInput: string) => {
    const hours = Number(hoursInput);
    if (!Number.isFinite(hours) || hours < 0) {
      return undefined;
    }
    return Math.round(hours * 60);
  };

  const resetAddForm = useCallback(() => {
    //  Reset form fields so previous input does not persist
    setGameName("");
    setHoursInput("0");
    setImageUri(null);
  }, []);

  //  Open add game modal and ensure form starts fresh
  const openAddModal = useCallback(() => {
    resetAddForm(); // clear old form values
    setAddOpen(true); // show modal form
  }, [resetAddForm]);

  const closeAddModal = useCallback(() => {
    setAddOpen(false);
  }, []);

  const pickImageAsync = async () => {
    // Ask permission to access the user's photo library
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo Access to pick an image",
      );
      return;
    }

    // Open the image library picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to images only
      allowsEditing: true, // allow user to crop image
      aspect: [4, 3], // Maintain a 4:3 ratio
      quality: 1, // max quality
    });

    // if user cancels do nothing
    if (result.canceled) {
      return;
    }

    // ensure we have an asset
    const uri = result?.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };

  const loadGame = useCallback(async () => {
    console.log("Calling getGames");
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
    })();
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

  const onCreateGame = useCallback(async () => {
    // Validate form fields before API Call
    const name = gameName.trim();
    if (!name) {
      Alert.alert("Missing name", "Please! Enter a game name.");
      return;
    }
    const minutes = convertHoursToMinutes(hoursInput);
    if (minutes === undefined) {
      Alert.alert("Invalid playtime", "Enter hours 0 or more.");
      return;
    }

    try {
      setCreating(true);
      // imageUri is local , will add upload to generate upoload Url later
      await createGame({
        name,
        initialPlaytimeMinutes: minutes,
        imageUrl: null,
      });

      closeAddModal();
      resetAddForm();
      // Refresh list after succesfull create
      await loadGame();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }, [gameName, hoursInput, closeAddModal, loadGame]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>My Game</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Add game modal UI */}

      <Modal
        visible={addOpen}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Game</Text>
            <Pressable onPress={pickImageAsync} style={styles.pickBtn}>
              <Text style={styles.pickBtnText}>Pick Image</Text>
            </Pressable>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImg} />
            )}
            <Text style={styles.label}>Enter game name:</Text>
            <TextInput
              value={gameName}
              onChangeText={setGameName}
              autoCorrect={false}
              style={styles.input}
              placeholder="e.g. Valorant"
              placeholderTextColor={"#888"}
            />

            <Text style={styles.label}>Enter your playtime hours:</Text>
            <TextInput
              value={hoursInput}
              onChangeText={setHoursInput}
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor={"#888"}
            />

            <View style={styles.row}>
              <Pressable onPress={closeAddModal} style={styles.btnGhost}>
                <Text style={styles.btnGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={onCreateGame}
                disabled={creating}
                style={[styles.btnPrimary, creating && { opacity: 0.6 }]}
              >
                <Text style={styles.btnPrimaryText}>
                  {creating ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <GameList
        games={games}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDelete={onDelete}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#111",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    color: "#fff",
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
  },
  pickBtn: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  pickBtnText: {
    color: "#fff",
  },
  previewImg: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  btnGhostText: {
    color: "#fff",
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  btnPrimaryText: {
    color: "#000",
    fontWeight: "700",
  },
});
