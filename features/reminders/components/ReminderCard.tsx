import { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Reminder } from "@/lib/reminders";

interface Props {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReminderCard({ reminder, onEdit, onDelete }: Props) {
  const { icon, headerBg, textColor } = useMemo(() => {
    switch (reminder.reminder_type) {
      case "game_time":
        return { icon: "🎮", headerBg: "bg-indigo-50", textColor: "text-indigo-600" };
      case "session_limit":
        return { icon: "⏱️", headerBg: "bg-amber-50", textColor: "text-amber-600" };
      case "break_reminder":
        return { icon: "☕", headerBg: "bg-emerald-50", textColor: "text-emerald-600" };
      default:
        return { icon: "🔔", headerBg: "bg-blue-50", textColor: "text-blue-600" };
    }
  }, [reminder.reminder_type]);

  const formatTitle = useMemo(() => {
    return reminder.reminder_type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [reminder.reminder_type]);

  return (
    <View className="bg-white rounded-2xl mb-4 mx-1 shadow-sm border border-gray-100 overflow-hidden">
      <View className={`p-4 ${headerBg} border-b border-gray-100`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-2xl">{icon}</Text>
            <Text className="text-base font-bold text-gray-800">{formatTitle}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${headerBg}`}>
            <Text className={`text-xs font-semibold ${textColor}`}>
              {reminder.reminder_value} min
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        {reminder.scheduled_time && (
          <View className="flex-row items-center mb-3">
            <Text className="text-lg" style={{ marginRight: 8 }}>📅</Text>
            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-medium">Scheduled</Text>
              <Text className="text-sm text-gray-700 font-medium">
                {reminder.scheduled_time}
              </Text>
            </View>
          </View>
        )}

        {reminder.scheduled_days && reminder.scheduled_days.length > 0 && (
          <View className="flex-row items-center mb-3">
            <Text className="text-lg" style={{ marginRight: 8 }}>🔄</Text>
            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-medium">Repeat</Text>
              <Text className="text-sm text-gray-700 font-medium">
                {reminder.scheduled_days.map((d) => d.slice(0, 3)).join(" • ")}
              </Text>
            </View>
          </View>
        )}

        {reminder.game_name && (
          <View className="flex-row items-center">
            <Text className="text-lg" style={{ marginRight: 8 }}>🎯</Text>
            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-medium">Game</Text>
              <Text className="text-sm text-gray-700 font-medium">
                {reminder.game_name}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="flex-row justify-end px-4 pb-4" style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={onEdit}
          className="px-4 py-2.5 bg-gray-50 rounded-xl active:bg-gray-100"
        >
          <Text className="text-gray-700 font-semibold text-sm">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          className="px-4 py-2.5 bg-red-50 rounded-xl active:bg-red-100"
        >
          <Text className="text-red-500 font-semibold text-sm">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
