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
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addIgdbGame,
  createGame,
  deleteGame,
  Game,
  getGames,
  uploadGameImage,
} from "./games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import GameList from "@/components/GameList";
import * as ImagePicker from "expo-image-picker";
import AddGameCard from "@/components/AddGameCard";
import { searchIgdb } from "../igdb/igdb.service";
import { router, useFocusEffect } from "expo-router";

type IgdbGame = {
  igdbId: number;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
};

const minutesToHoursText = (minutes?: number | null) => {
  const m =
    typeof minutes === "number" && Number.isFinite(minutes) ? minutes : 0;
  const h = m / 60;
  return h % 1 === 0 ? `${h} hr` : `${h.toFixed(1)} hr`;
};

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

  // IGDB search states
  // ADD-from-IGDB flow state
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [igdbResults, setIgdbResults] = useState<IgdbGame[]>([]);
  const [selectedIgdb, setSelectedIgdb] = useState<IgdbGame | null>(null);
  const [addIgdbOpen, setAddIgdbOpen] = useState(false);
  const [playedBefore, setPlayedBefore] = useState<boolean | null>(null);
  const [playedHoursInput, setPlayedHoursInput] = useState("0");
  const [addIgdb, setAddIgdb] = useState(false);

  // Sequence counter to ignore stale IGDB search response
  const searchSeq = useRef(0);
  const q = searchText.trim();

  // IGDB somtimes return protocol-relative URLs ("//..."). Normalize for mobile.
  const normalizeIgdbImage = useCallback((url?: string | null) => {
    if (!url) return null;
    return url.startsWith("//") ? `https:${url}` : url;
  }, []);

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

  // Debounced IGDB search (wait for user to pause typing )
  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2) {
      setIgdbResults([]);
      setSearching(false);
      return;
    }

    const t = setTimeout(async () => {
      const seq = ++searchSeq.current;

      try {
        setSearching(true);
        const data = await searchIgdb(query);

        // Ignore stale responses if user typed again
        if (seq !== searchSeq.current) return;

        setIgdbResults(
          data.map((g) => ({
            ...g,
            imageUrl: normalizeIgdbImage(g.imageUrl),
          })),
        );
      } catch (err) {
        // show error only if still the latest request
        if (seq == searchSeq.current) {
          Alert.alert("Error", getApiErrorMessage(err));
          setIgdbResults([]);
        }
      } finally {
        // only clear loading if this request is still current
        if (seq === searchSeq.current) setSearching(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [searchText]);

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
      const imageUrl = imageUri ? await uploadGameImage(imageUri) : null;
      // imageUri is local , will add upload to generate upoload Url later
      await createGame({
        name,
        initialPlaytimeMinutes: minutes,
        imageUrl: imageUrl,
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

  // Start Add from IGDB flow
  // Open/Close IGDB add flow modal and reset its state
  const openIgdbAddFlow = useCallback((item: IgdbGame) => {
    setSelectedIgdb(item);
    setPlayedBefore(null);
    setPlayedHoursInput("0");
    setAddIgdbOpen(true);
  }, []);

  const closeIgdbAddFlow = useCallback(() => {
    setSelectedIgdb(null);
    setAddIgdbOpen(false);
    setPlayedBefore(null);
    setPlayedHoursInput("0");
  }, []);

  const onConfirmAddIgdb = useCallback(async () => {
    if (!selectedIgdb) return;

    if (playedBefore === null) {
      Alert.alert("Select Yes or No");
      return;
    }

    let minutes = 0;

    if (playedBefore === true) {
      const m = convertHoursToMinutes(playedHoursInput);

      if (m === undefined) {
        Alert.alert("Invalid Playtime", "Hours must be 0 or more");
        return;
      }
      minutes = m;
    }

    try {
      setAddIgdb(true);

      await addIgdbGame({
        igdbId: selectedIgdb.igdbId,
        name: selectedIgdb.name,
        imageUrl: normalizeIgdbImage(selectedIgdb.imageUrl) ?? null,
        description: selectedIgdb.description ?? null,
        playedBefore,
        initialPlaytimeMinutes: minutes,
      });

      closeIgdbAddFlow();
      setSearchText("");
      setIgdbResults([]);
      await loadGame();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setAddIgdb(false);
    }
  }, [
    selectedIgdb,
    playedBefore,
    playedHoursInput,
    closeIgdbAddFlow,
    loadGame,
  ]);

  useFocusEffect(
    useCallback(() => {
      void loadGame();
    }, [loadGame]),
  );

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
      {/* Search input for discovering games from IGDB */}
      <View style={{ padding: 7, gap: 8, marginBottom: 30, marginTop: 20 }}>
        <TextInput
          placeholder="e.g. Elden ring"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          placeholderTextColor={"#888"}
          style={styles.input}
        ></TextInput>
        {searchText.length > 0 ? (
          <Pressable
            onPress={() => {
              setSearchText("");
              setIgdbResults([]);
            }}
          >
            <Text>Clear</Text>
          </Pressable>
        ) : null}

        {searching ? (
          <Text>Searching...</Text>
        ) : q.length >= 2 && igdbResults.length === 0 ? (
          <Text>No results!</Text>
        ) : null}
      </View>

      {q.length >= 2 ? (
        <FlatList
          data={igdbResults}
          keyExtractor={(item) => String(item.igdbId)}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View style={styles.igdbRow}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.igdbCover}
                />
              ) : (
                <View style={styles.igdbCoverPlaceholder}></View>
              )}

              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.igdbTitle}>
                  {item.name}
                </Text>
              </View>

              <Pressable
                onPress={() => openIgdbAddFlow(item)}
                style={styles.igdbAddBtn}
              >
                <Text style={styles.igdbAddText}>Add</Text>
              </Pressable>
            </View>
          )}
        ></FlatList>
      ) : null}

      {/* IGDB Add modal: ask if played and collect hours if needed */}
      <Modal
        visible={addIgdbOpen}
        animationType="fade"
        onRequestClose={closeIgdbAddFlow}
      >
        <View style={styles.popupBackdrop}>
          <Text style={styles.popupTitle}>
            Add {selectedIgdb?.name ?? "game"}
          </Text>

          <Text style={styles.popupText}>
            Have you played this game before?
          </Text>

          <View style={styles.popupRow}>
            <Pressable
              style={[
                styles.choiceBtn,
                playedBefore === true && styles.choiceBtnActive,
              ]}
              onPress={() => setPlayedBefore(true)}
            >
              <Text style={styles.choiceText}>Yes</Text>
            </Pressable>

            <Pressable
              style={[
                styles.choiceBtn,
                playedBefore === false && styles.choiceBtnActive,
              ]}
              onPress={() => setPlayedBefore(false)}
            >
              <Text style={styles.choiceText}>No</Text>
            </Pressable>
          </View>

          {playedBefore === true ? (
            <>
              <Text style={styles.label}>Enter Playtime (hours):</Text>
              <TextInput
                onChangeText={setPlayedHoursInput}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="0"
                placeholderTextColor={"#888"}
              />
            </>
          ) : null}

          <View style={styles.popupActions}>
            <Pressable
              style={styles.btnGhost}
              onPress={closeIgdbAddFlow}
              disabled={addIgdb}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.btnPrimary}
              onPress={onConfirmAddIgdb}
              disabled={addIgdb}
            >
              <Text style={styles.btnPrimaryText}>
                {addIgdb ? "Adding..." : "Add to list"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

            {/* Input fields for game Info */}
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
              onChangeText={setHoursInput}
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor={"#888"}
            />

            {/* Cancel button UI */}
            <View style={styles.row}>
              <Pressable
                onPress={closeAddModal}
                disabled={creating}
                style={[styles.btnGhost, creating && { opacity: 0.6 }]}
              >
                <Text style={styles.btnGhostText}>Cancel</Text>
              </Pressable>

              {/* Save button logic */}
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
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  modalTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    color: "#000",
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#000",
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
    color: "#000",
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
    color: "#000",
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  igdbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
  },

  igdbCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  igdbCoverPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  igdbTitle: {
    fontWeight: "600",
  },

  igdbAddBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  igdbAddText: {
    fontWeight: "700",
    color: "#000",
  },

  popupBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  popupCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 16,
  },

  popupTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  popupText: {
    color: "#ddd",
    marginBottom: 12,
  },

  popupRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  choiceBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },

  choiceBtnActive: {
    backgroundColor: "#fff",
  },

  choiceText: {
    color: "#000",
    fontWeight: "700",
  },

  popupActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
});
