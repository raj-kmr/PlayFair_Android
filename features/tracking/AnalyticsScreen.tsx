import PlaytimeChart from "@/components/analytics/PlaytimeChart";
import SectionHeader from "@/components/analytics/SectionHeader";
import StatCard from "@/components/analytics/StatCard";
import TaskCompletionCard from "@/components/analytics/TaskCompletionCard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function AnalyticsScreen() {
  const { loading, playtime, sessions, tasks } = useAnalytics();

  const normalizeWeeklyData = (data: any[]) => {
    const map = new Map();

    data.forEach((d) => {
        map.set(d.day, Number(d.minutes) || 0)
    })

    const result = [];
    const today = new Date();

    for(let i = 6; i >= 0; i--){
        const d = new Date();
        d.setDate(today.getDate() - i)
        const key = d.toISOString().split("T")[0];

        result.push({
            day: key,
            minutes: map.get(key) || 0
        })
    }
    return result;
  }

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#00ff99" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      {/* Total Playtime */}
      <SectionHeader title="Overview" />

      <View style={styles.row}>
        <StatCard title="Total minutes" value={playtime?.total_minute || 0} />
        <StatCard title="Sessions" value={sessions?.total_minute || 0} />
      </View>

      <View style={styles.row}>
        <StatCard
          title="Avg Session"
          value={
            isFinite(sessions?.avg_session_minutes)
              ? Math.round(sessions.avg_session_minutes)
              : 0
          }
        />

        <StatCard
          title="Max Session"
          value={sessions?.max_session_minutes || 0}
        />
      </View>

      {/* Weekly chart */}
      <SectionHeader title="Weekly Playtime" />
      <PlaytimeChart data={normalizeWeeklyData(playtime?.weekly || [])} />

      {/* Task chart */}
      <SectionHeader title="Productivity" />
      <TaskCompletionCard percentage={tasks?.percentage || 0} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 2,
        borderColor: "#ff0000",
        borderWidth: 1
    },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
