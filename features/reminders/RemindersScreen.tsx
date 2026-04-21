import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ReminderCard from "./components/ReminderCard";
import ReminderFormModal from "./components/ReminderFormModal";

import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "@/lib/api/reminders.api";

import { Reminder } from "@/lib/reminders";
import { useSessionNotifications } from "@/hooks/useSessionNotifications";

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Reminder | null>(null);

  const {
    scheduleSessionWarnings,
    cancelSessionWarnings,
    scheduleGameTimeAlert,
    cancelGameTimeAlert,
  } = useSessionNotifications();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  const handleCreate = async (data: any) => {
    try {
      console.log("Creating reminder with data:", data);
      await createReminder(data);

      if (data.reminderType === "game_time" && data.scheduledTime) {
        await scheduleGameTimeAlert(Date.now(), data.scheduledTime);
      }

      fetchReminders();
    } catch (err: any) {
      console.error("Create reminder error:", err);
      console.error("Response data:", err?.response?.data);
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to create reminder"
      );
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selected) return;
    try {
      console.log("Updating reminder with data:", data);
      await updateReminder(selected.id, data);

      if (data.reminderType === "game_time" && data.scheduledTime) {
        await scheduleGameTimeAlert(
          selected.id,
          data.scheduledTime,
          selected.game_name
        );
      } else if (selected.reminder_type === "game_time") {
        await cancelGameTimeAlert(selected.id);
      }

      setSelected(null);
      fetchReminders();
    } catch (err: any) {
      console.error("Update reminder error:", err);
      console.error("Response data:", err?.response?.data);
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to update reminder"
      );
    }
  };

  const handleDelete = async (id: number) => {
    const reminder = reminders.find((r) => r.id === id);

    if (reminder?.reminder_type === "game_time") {
      await cancelGameTimeAlert(id);
    }

    await deleteReminder(id);
    fetchReminders();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders.filter((r) => r.is_active)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onEdit={() => {
              setSelected(item);
              setModalVisible(true);
            }}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={48} color="#475569" />
            <Text style={styles.emptyTitle}>No reminders yet</Text>
            <Text style={styles.emptyText}>
              Create a reminder to stay on track with your gaming goals
            </Text>
          </View>
        }
        contentContainerStyle={
          reminders.filter((r) => r.is_active).length === 0
            ? { flexGrow: 1 }
            : undefined
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelected(null);
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      <ReminderFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={selected ? handleUpdate : handleCreate}
        initialData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    backgroundColor: "#7c3aed",
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    bottom: 24,
    right: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});