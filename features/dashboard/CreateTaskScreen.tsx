import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createTask } from "./task.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";

export default function CreateTaskScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("custom");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }

    try {
      setLoading(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        frequency: "daily",
      });
      Alert.alert("Success", "Task created successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Go to gym"
        placeholderTextColor={"#666"}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Optional"
        style={[styles.input, styles.textarea]}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryRow}>
        {["health", "study", "work", "custom"].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoryChip,
              category === item && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Task"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  label: {
    color: "#111",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    color: "#111",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  categoryChipActive: {
    backgroundColor: "#111",
  },
  categoryText: {
    color: "#111",
    textTransform: "capitalize",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
