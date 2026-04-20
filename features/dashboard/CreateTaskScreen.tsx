import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createTask } from "./task.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import { useRouter } from "expo-router";

const categories = [
  { id: "health", label: "Health", icon: "favorite" },
  { id: "study", label: "Study", icon: "school" },
  { id: "work", label: "Work", icon: "work" },
  { id: "custom", label: "Custom", icon: "star" },
];

export default function CreateTaskScreen() {
  const router = useRouter();
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
      Alert.alert("Success", "Habit created successfully");
      router.back();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="add-task" size={24} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Create New Habit</Text>
          <Text style={styles.headerSubtitle}>
            Build consistency, unlock rewards
          </Text>
        </View>
      </View>

      {/* Title Input */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <MaterialIcons name="title" size={18} color="#94a3b8" />
          <Text style={styles.label}>Title</Text>
        </View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Morning workout"
          placeholderTextColor="#475569"
          style={styles.input}
        />
      </View>

      {/* Description Input */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <MaterialIcons name="description" size={18} color="#94a3b8" />
          <Text style={styles.label}>Description</Text>
        </View>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Optional details about your habit"
          placeholderTextColor="#475569"
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <MaterialIcons name="category" size={18} color="#94a3b8" />
          <Text style={styles.label}>Category</Text>
        </View>
        <View style={styles.categoryRow}>
          {categories.map((item) => {
            const isActive = category === item.id;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(item.id)}
              >
                <MaterialIcons
                  name={item.icon}
                  size={18}
                  color={isActive ? "#ffffff" : "#64748b"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Create Button */}
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <View style={styles.buttonContent}>
            <MaterialIcons name="check" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Create Habit</Text>
          </View>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 2,
  },
  field: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 15,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryChipActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  categoryText: {
    color: "#94a3b8",
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
