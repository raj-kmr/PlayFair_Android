import { View, Text, Modal, Pressable, TextInput, StyleSheet } from "react-native";
import type { IgdbGame } from "../hooks/useIgdbSearch";

type AddIgdbGameModalProps = {
  visible: boolean;
  game: IgdbGame | null;
  onClose: () => void;
  onConfirm: () => void;
  playedBefore: boolean | null;
  setPlayedBefore: (value: boolean) => void;
  playedHoursInput: string;
  setPlayedHoursInput: (value: string) => void;
  adding: boolean;
};

export function AddIgdbGameModal({
  visible,
  game,
  onClose,
  onConfirm,
  playedBefore,
  setPlayedBefore,
  playedHoursInput,
  setPlayedHoursInput,
  adding,
}: AddIgdbGameModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Text style={styles.title}>
          Add {game?.name ?? "game"}
        </Text>

        <Text style={styles.text}>
          Have you played this game before?
        </Text>

        <View style={styles.row}>
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
              value={playedHoursInput}
              onChangeText={setPlayedHoursInput}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="0"
              placeholderTextColor={"#888"}
            />
          </>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={styles.btnGhost}
            onPress={onClose}
            disabled={adding}
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={styles.btnPrimary}
            onPress={onConfirm}
            disabled={adding}
          >
            <Text style={styles.btnPrimaryText}>
              {adding ? "Adding..." : "Add to list"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#ddd",
    marginBottom: 12,
  },
  row: {
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
  label: {
    color: "#ddd",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#000",
    marginBottom: 12,
    width: "100%",
    maxWidth: 420,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
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
