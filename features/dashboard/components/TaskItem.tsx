import { DailyTask } from "@/features/dashboard/task.types";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
      ></View>
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
    backgroundColor: "#000",
    marginBottom: 12,
  },

  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    marginTop: 2,
  },

  checkBoxActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  titleDone: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  category: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
    textTransform: "capitalize",
  },

  description: {
    color: "#fff",
    marginTop: 6,
    fontSize: 13,
  },
});
