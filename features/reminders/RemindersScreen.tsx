import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { AxiosError } from "axios";

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
        await scheduleGameTimeAlert(
          Date.now(),
          data.scheduledTime,
        );
      }
      
      fetchReminders();
    } catch (err: any) {
      console.error("Create reminder error:", err);
      console.error("Response data:", err?.response?.data);
      Alert.alert("Error", err?.response?.data?.error || "Failed to create reminder");
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
      Alert.alert("Error", err?.response?.data?.error || "Failed to update reminder");
    }
  };

  const handleDelete = async (id: number) => {
    const reminder = reminders.find(r => r.id === id);
    
    if (reminder?.reminder_type === "game_time") {
      await cancelGameTimeAlert(id);
    }
    
    await deleteReminder(id);
    fetchReminders();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f3f4f6' }}>

      <FlatList
        data={reminders.filter(r => r.is_active)}
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
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#3b82f6',
          padding: 16,
          borderRadius: 9999,
          position: 'absolute',
          bottom: 24,
          right: 24,
        }}
        onPress={() => {
          setSelected(null);
          setModalVisible(true);
        }}
      >
        <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
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