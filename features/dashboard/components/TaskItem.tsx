import { DailyTask } from "@/features/dashboard/task.types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"

type Props = {
  task: DailyTask;
  onToggle: (task: DailyTask) => void;
  disabled?: boolean;
};

export default function TaskItem({ task, onToggle, disabled }: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onToggle(task)}
      disabled={disabled}
    >
      <View
        style={[styles.checkBox, task.isCompleted && styles.checkBoxActive]}
      >
        {task.isCompleted && (
          <Ionicons name="checkmark" size={18} color={"#fff"}/>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.titleDone]}>
          {task.title}
        </Text>
        {!!task.category && (
          <Text style={styles.category}>{task.category}</Text>
        )}
        {!!task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderColor: "#e5e5e5",
    borderWidth: 1
  },

  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000",
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center"
  },

  checkBoxActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },

  titleDone: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  category: {
    color: "#666",
    marginTop: 4,
    fontSize: 12,
    textTransform: "capitalize",
  },

  description: {
    color: "#888",
    marginTop: 6,
    fontSize: 13,
  },
});
