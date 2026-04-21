import TaskSection from "@/features/dashboard/components/TaskSection";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Index() {

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="pb-32"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="px-6 pt-12 pb-6 bg-gradient-to-b from-violet-900/20 to-transparent">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-slate-400 text-sm font-medium">Welcome back</Text>
            <Text className="text-3xl font-bold text-white mt-1">Dashboard</Text>
          </View>
          <View className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl items-center justify-center shadow-lg shadow-violet-500/30">
            <MaterialIcons name="sports-esports" size={24} color="#ffffff" />
          </View>
        </View>

        {/* Daily Streak Card */}
        <View className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-5 shadow-lg shadow-violet-500/20">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <MaterialIcons name="whatshot" size={24} color="#ffffff" />
            </View>
            <View>
              <Text className="text-white/80 text-sm font-medium">Daily Streak</Text>
              <Text className="text-2xl font-bold text-white">Keep it up!</Text>
            </View>
          </View>
          <Text className="text-white/70 text-sm leading-relaxed">
            Complete your daily habits to unlock gaming time and build healthy routines.
          </Text>
        </View>
      </View>

      {/* Quick Stats Row */}
      <View className="flex-row px-6 gap-3 mb-6">
        <View className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="task-alt" size={18} color="#a78bfa" />
            <Text className="text-slate-400 text-xs font-medium">Tasks</Text>
          </View>
          <Text className="text-2xl font-bold text-white">Today</Text>
        </View>
        <View className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="schedule" size={18} color="#34d399" />
            <Text className="text-slate-400 text-xs font-medium">Play Time</Text>
          </View>
          <Text className="text-2xl font-bold text-white">Earned</Text>
        </View>
      </View>

      {/* Task Section */}
      <View className="px-6">
        <TaskSection />
      </View>
    </ScrollView>
  );
}