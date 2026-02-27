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
import GameCard from "../../components/GameCard";
import { useCallback, useEffect, useState } from "react";
import { deleteGame, Game, getGames } from "./games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import GameList from "@/components/GameList";
import * as ImagePicker from "expo-image-picker";

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
    if(!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo Access to pick an image")
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
    if(uri) setImageUri(uri)
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

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>My Game</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

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

  return (
    <>
      {/* Add game modal UI */}
      <Modal
        visible={addOpen}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View>
          <Text>Add Game</Text>
          <Pressable onPress={pickImageAsync}>
            <Text>Pick Image</Text>
          </Pressable>

          {imageUri && <Image source={{ uri: imageUri }} />}
          <Text>Enter game name:</Text>
          <TextInput
            value={gameName}
            onChangeText={setGameName}
            autoCorrect={false}
          />

          <Text>Enter your playtime hours:</Text>
          <TextInput
            value={hoursInput}
            onChangeText={setHoursInput}
            keyboardType="numeric"
          />

          <Button onPress={closeAddModal} title="Cancel"></Button>

          <Button
            onPress={() => {
              console.log(
                "Game Name: " + gameName,
                "Playtime Hours: " + hoursInput,
                "Image Uri: " + imageUri,
              );
            }}
            title="Save"
          ></Button>
        </View>
      </Modal>

      <GameList
        games={games}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDelete={onDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  // container: { flex: 1, padding: 16 },
  // subTitle: { fontSize: 14, opacity: 0.7, marginBottom: 12 },

  // list: { paddingBottom: 24 },
  // emptyWrap: { flexGrow: 1, justifyContent: "center" },
  // emptyText: { textAlign: "center", opacity: 0.7 },

  // card: {
  //   flexDirection: "row",
  //   borderWidth: 1,
  //   borderColor: "#2a2a2a",
  //   borderRadius: 14,
  //   padding: 12,
  //   marginBottom: 12,
  // },
  // cover: { width: 54, height: 54, borderRadius: 10, marginRight: 12 },
  // coverPlaceholder: {
  //   width: 54,
  //   height: 54,
  //   borderRadius: 10,
  //   marginRight: 12,
  //   borderWidth: 1,
  //   borderColor: "#2a2a2a",
  // },
  // cardBody: { flex: 1 },
  // gameName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  // meta: { fontSize: 12, opacity: 0.75 },

  // actions: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end" },
  // iconBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  // deleteText: { fontSize: 18 },
});
