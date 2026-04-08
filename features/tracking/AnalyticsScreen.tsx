import PlaytimeChart from "@/components/analytics/PlaytimeChart";
import SectionHeader from "@/components/analytics/SectionHeader";
import StatCard from "@/components/analytics/StatCard";
import TaskCompletionCard from "@/components/analytics/TaskCompletionCard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AnalyticsScreen() {
  const { loading, error, playtime, sessions, tasks } = useAnalytics();

  const normalizeWeeklyData = (data: any[]) => {
    return data.map((d) => ({
      day: d.day,
      minutes: Number(d.minutes) || 0
    }));
  };

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#00ff99" />
    </View>
  );
}

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Failed to load analytics</Text>
      <Text style={styles.errorMessage}>{error}</Text>
    </View>
  );
}

const hasNoData = 
  (playtime?.total_minute === 0 || playtime?.total_minute === undefined) &&
  (sessions?.total_sessions === 0 || sessions?.total_sessions === undefined);

if (hasNoData) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No data yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your gaming sessions and completing tasks to see your analytics here!
      </Text>
    </View>
  );
}

  return (
    <View style={styles.container}>
      {/* Total Playtime */}
      <SectionHeader title="Overview" />

      <View style={styles.row}>
        <StatCard title="Total minutes" value={playtime?.total_minute || 0} />
        <StatCard title="Sessions" value={sessions?.total_sessions || 0} />
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
      <SectionHeader title="Productivity (Last 7 Days)" />
      <TaskCompletionCard 
        percentage={tasks?.percentage || 0} 
        completed={tasks?.completed || 0}
        total={tasks?.total || 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
