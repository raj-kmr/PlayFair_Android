import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Reminder } from "@/lib/reminders";

interface Props {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReminderCard({ reminder, onEdit, onDelete }: Props) {
  const { icon, iconBg, textColor } = useMemo(() => {
    switch (reminder.reminder_type) {
      case "game_time":
        return { icon: "sports-esports", iconBg: "#312e81", textColor: "#818cf8" };
      case "session_limit":
        return { icon: "timer", iconBg: "#78350f", textColor: "#fbbf24" };
      case "break_reminder":
        return { icon: "coffee", iconBg: "#064e3b", textColor: "#34d399" };
      default:
        return { icon: "notifications", iconBg: "#1e3a5f", textColor: "#60a5fa" };
    }
  }, [reminder.reminder_type]);

  const formatTitle = useMemo(() => {
    return reminder.reminder_type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [reminder.reminder_type]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <MaterialIcons name={icon} size={20} color="#ffffff" />
          </View>
          <Text style={styles.title}>{formatTitle}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: textColor }]}>
            {reminder.reminder_value} min
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {reminder.scheduled_time && (
          <View style={styles.row}>
            <MaterialIcons name="event" size={18} color="#64748b" style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Scheduled</Text>
              <Text style={styles.rowValue}>{reminder.scheduled_time}</Text>
            </View>
          </View>
        )}

        {reminder.scheduled_days && reminder.scheduled_days.length > 0 && (
          <View style={styles.row}>
            <MaterialIcons name="repeat" size={18} color="#64748b" style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Repeat</Text>
              <Text style={styles.rowValue}>
                {reminder.scheduled_days.map((d) => d.slice(0, 3)).join(" • ")}
              </Text>
            </View>
          </View>
        )}

        {reminder.game_name && (
          <View style={styles.row}>
            <MaterialIcons name="games" size={18} color="#64748b" style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Game</Text>
              <Text style={styles.rowValue}>{reminder.game_name}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#0f172a",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  body: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rowIcon: {
    marginRight: 10,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editText: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#450a0a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7f1d1d",
  },
  deleteText: {
    color: "#f87171",
    fontSize: 13,
    fontWeight: "600",
  },
});
