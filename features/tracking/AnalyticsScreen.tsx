import PlaytimeChart from "@/components/analytics/PlaytimeChart";
import SectionHeader from "@/components/analytics/SectionHeader";
import StatCard from "@/components/analytics/StatCard";
import TaskCompletionCard from "@/components/analytics/TaskCompletionCard";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import Skeleton from "@/components/analytics/Skeleton";
import TimeRangeSelector from "@/components/analytics/TimeRangeSelector";
import { MaterialIcons } from "@expo/vector-icons";

const formatMinutesToHM = (minutes: number) => {
  if (!minutes || minutes <= 0) return "0m";

  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;

  return `${hrs}h ${mins}m`;
};

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, playtime, sessions, tasks, refetch } =
    useAnalytics(timeRange);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(true);
    setRefreshing(false);
  };

  const normalizeWeeklyData = (data: any[]) => {
    return data.map((d) => ({
      day: d.day,
      minutes: Number(d.minutes) || 0,
    }));
  };

  const normalizeMonthlyData = (data: any[]) => {
    return data.map((d) => ({
      week: d.week,
      minutes: Number(d.minutes) || 0,
    }));
  };

  // Calculate trend indicators (up/down from last week)
  const getTrend = (
    current: number,
    previous: number,
  ): "up" | "down" | null => {
    if (current > previous) return "up";
    if (current < previous) return "down";
    return null;
  };

  const playtimeTrend =
    playtime?.previous_total_minutes !== undefined
      ? getTrend(playtime?.total_minutes || 0, playtime.previous_total_minutes)
      : null;

  const sessionsTrend =
    sessions?.previous_week_sessions !== undefined
      ? getTrend(sessions?.total_sessions || 0, sessions.previous_week_sessions)
      : null;

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="insights" size={24} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        <SectionHeader title="Overview" />
        <View style={styles.row}>
          <StatCard
            title="Total minutes"
            value={<Skeleton width={80} height={24} borderRadius={4} />}
          />
          <StatCard
            title="Sessions"
            value={<Skeleton width={60} height={24} borderRadius={4} />}
          />
        </View>
        <View style={styles.row}>
          <StatCard
            title="Avg Session"
            value={<Skeleton width={80} height={24} borderRadius={4} />}
          />
          <StatCard
            title="Max Session"
            value={<Skeleton width={80} height={24} borderRadius={4} />}
          />
        </View>
        <SectionHeader title="Weekly Playtime" />
        <Skeleton width="100%" height={200} borderRadius={10} margin={10} />
        <SectionHeader title="Productivity (Last 7 Days)" />
        <Skeleton width="100%" height={100} borderRadius={10} margin={10} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#f87171" />
        <Text style={styles.errorTitle}>Failed to load analytics</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  const hasNoData =
    (playtime?.total_minutes === 0 || playtime?.total_minutes === undefined) &&
    (sessions?.total_sessions === 0 || sessions?.total_sessions === undefined);

  if (hasNoData) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="insert-chart-outlined" size={48} color="#475569" />
        <Text style={styles.emptyTitle}>No data yet</Text>
        <Text style={styles.emptyText}>
          Start tracking your gaming sessions and completing tasks to see your
          analytics here!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="insights" size={24} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>
            Track your productivity journey
          </Text>
        </View>
      </View>

      {/* Time Range Selector */}
      <TimeRangeSelector
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
      />

      {/* Overview Section */}
      <SectionHeader title="Overview" />
      <View style={styles.row}>
        <StatCard
          title="Total Playtime"
          value={formatMinutesToHM(playtime?.total_minutes || 0)}
          trend={playtimeTrend}
        />
        <StatCard
          title="Sessions"
          value={sessions?.total_sessions || 0}
          trend={sessionsTrend}
        />
      </View>

      <View style={styles.row}>
        <StatCard
          title="Avg Session"
          value={formatMinutesToHM(sessions?.avg_session_minutes || 0)}
        />
        <StatCard
          title="Max Session"
          value={formatMinutesToHM(sessions?.max_session_minutes || 0)}
        />
      </View>

      {/* Playtime Chart */}
      <SectionHeader
        title={`${timeRange === "7d" ? "Weekly" : "Monthly"} Playtime`}
      />
      <View style={styles.chartContainer}>
        {timeRange === "7d" ? (
          playtime?.weekly && playtime.weekly.length > 0 ? (
            <PlaytimeChart data={normalizeWeeklyData(playtime.weekly)} />
          ) : (
            <View style={styles.emptyChart}>
              <MaterialIcons name="trending-flat" size={32} color="#475569" />
              <Text style={styles.emptyChartText}>No weekly data available</Text>
            </View>
          )
        ) : playtime?.monthly && playtime.monthly.length > 0 ? (
          <PlaytimeChart data={normalizeMonthlyData(playtime.monthly)} />
        ) : (
          <View style={styles.emptyChart}>
            <MaterialIcons name="trending-flat" size={32} color="#475569" />
            <Text style={styles.emptyChartText}>No monthly data available</Text>
          </View>
        )}
      </View>

      {/* Task Completion */}
      <SectionHeader
        title={`Productivity (${timeRange === "7d" ? "Last 7 Days" : "Last 30 Days"})`}
      />
      <TaskCompletionCard
        percentage={tasks?.percentage || 0}
        completed={tasks?.completed || 0}
        total={tasks?.total || 0}
        timeRange={timeRange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  emptyChart: {
    height: 200,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyChartText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 8,
  },
});
