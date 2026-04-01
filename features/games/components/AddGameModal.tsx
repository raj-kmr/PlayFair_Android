import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadGameImage, createGame } from "../games.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";

type AddGameModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function AddGameModal({ visible, onClose, onSaved }: AddGameModalProps) {
  const [gameName, setGameName] = useState("");
  const [hoursInput, setHoursInput] = useState("0");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const convertHoursToMinutes = (hoursInput: string) => {
    const hours = Number(hoursInput);
    if (!Number.isFinite(hours) || hours < 0) {
      return undefined;
    }
    return Math.round(hours * 60);
  };

  const resetForm = () => {
    setGameName("");
    setHoursInput("0");
    setImageUri(null);
  };

  const handlePickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo Access to pick an image",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) return;

    const uri = result?.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };

  const handleSave = async () => {
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
      await createGame({
        name,
        initialPlaytimeMinutes: minutes,
        imageUrl: imageUrl,
      });

      resetForm();
      onClose();
      onSaved();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add Game</Text>
          <Pressable onPress={handlePickImage} style={styles.pickBtn}>
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
            onChangeText={setHoursInput}
            keyboardType="numeric"
            style={styles.input}
            placeholder="0"
            placeholderTextColor={"#888"}
          />

          <View style={styles.row}>
            <Pressable
              onPress={onClose}
              disabled={creating}
              style={[styles.btnGhost, creating && { opacity: 0.6 }]}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
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
  );
}

const styles = StyleSheet.create({
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
});
