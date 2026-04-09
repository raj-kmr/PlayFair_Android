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
    >
      <View style={{ marginBottom: 10 }}>
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
        />
      </View>

      {/* Total Playtime */}
      <SectionHeader title="Overview" />

      <View style={styles.row}>
        <StatCard
          title="Total Playtime"
          value={
            formatMinutesToHM(playtime?.total_minutes || 0)
          }
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
          value={
            formatMinutesToHM(sessions?.avg_session_minutes || 0)
          }
        />
        <StatCard
          title="Max Session"
          value={
            formatMinutesToHM(sessions?.max_session_minutes || 0)
          }
        />
      </View>

      {/* Playtime chart */}
      <SectionHeader
        title={`${timeRange === "7d" ? "Weekly" : "Monthly"} Playtime`}
      />
      {timeRange === "7d" ? (
        playtime?.weekly && playtime.weekly.length > 0 ? (
          <PlaytimeChart data={normalizeWeeklyData(playtime.weekly)} />
        ) : (
          <View
            style={{
              height: 200,
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>
              No weekly data available
            </Text>
          </View>
        )
      ) : playtime?.monthly && playtime.monthly.length > 0 ? (
        <PlaytimeChart data={normalizeMonthlyData(playtime.monthly)} />
      ) : (
        <View
          style={{
            height: 200,
            backgroundColor: "#f5f5f5",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ color: "#666", fontSize: 14 }}>
            No monthly data available
          </Text>
        </View>
      )}

      {/* Task chart */}
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
