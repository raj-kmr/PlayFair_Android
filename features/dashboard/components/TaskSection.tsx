import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DailyTask, DailyTaskStatusResponse } from "../task.types";
import { getTodayDateString } from "@/lib/date";
import {
  getDailyTaskStatus,
  updateDailyTaskStatus,
} from "../task.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import ProgressHeader from "./ProcessHeader";
import TaskItem from "./TaskItem";
import { Ionicons } from "@expo/vector-icons";

export default function TaskSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [data, setData] = useState<DailyTaskStatusResponse | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const today = getTodayDateString();

  // function to load tasks from backend
  const loadData = useCallback(async () => {
    const response = await getDailyTaskStatus(today);
    setData(response);
  }, [today]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadData();
      } catch (err) {
        Alert.alert("Error", getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // pull to refresh function
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // User toggle tasks completion
  const onToggle = useCallback(
    async (task: DailyTask) => {
      if (!data) return;

      const previous = data;

      const nextTasks = data.tasks.map((item) =>
        item.id === task.id
          ? { ...item, isCompleted: !item.isCompleted }
          : item,
      );

      const completed = nextTasks.filter((item) => item.isCompleted).length;

      const total = nextTasks.length;

      const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

      setData({
        ...data,
        tasks: nextTasks,
        summary: {
          total,
          completed,
          percentage,
        },
      });

      try {
        setSubmittingId(task.id);
        await updateDailyTaskStatus(task.id, {
          date: today,
          isCompleted: !task.isCompleted,
        });
      } catch (err) {
        setData(previous);
        Alert.alert("Error", getApiErrorMessage(err));
      } finally {
        setSubmittingId(null);
      }
    },
    [data, today],
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  const pendingTasks = (data?.tasks || []).filter((task) => !task.isCompleted);
  const completedTasks = (data?.tasks || []).filter((task) => task.isCompleted);

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>

        <Pressable onPress={() => router.push("/create-task")}>
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <ProgressHeader
        completed={data?.summary.completed || 0}
        total={data?.summary.total || 0}
        percentage={data?.summary.percentage || 0}
      />

      {/* <FlatList
        data={data?.tasks || []}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={onToggle}
            disabled={submittingId === item.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptyText}>
              Add your first task to start unlocking game time.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      /> */}

      <View style={styles.listContent}>
        {!pendingTasks.length && !completedTasks.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>
              Add your first habit to start unlocking game time.
            </Text>
          </View>
        ) : (
          <>
            {!!pendingTasks.length && (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Pending</Text>

                {pendingTasks.map((item) => (
                  <TaskItem
                    key={item.id}
                    task={item}
                    onToggle={onToggle}
                    disabled={submittingId === item.id}
                  />
                ))}
              </View>
            )}
            {!!completedTasks.length && (
              <View style={styles.group}>
                <Pressable
                  style={styles.completedHeader}
                  onPress={() => setShowCompleted((prev) => !prev)}
                >
                  <Text style={styles.groupTitle}>
                    Completed ({completedTasks.length})
                  </Text>

                  <Ionicons
                    name={showCompleted ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color="#000"
                  />
                </Pressable>

                {showCompleted && (
                  <View style={styles.completedList}>
                    {completedTasks.map((item) => (
                      <TaskItem
                        key={item.id}
                        task={item}
                        onToggle={onToggle}
                        disabled={submittingId === item.id}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  addText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  listContent: {
    flexGrow: 1,
    marginTop: 8,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#1a1a1a",
    marginTop: 8,
    textAlign: "center",
  },
  group: {
    marginTop: 12,
  },

  groupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  completedList: {
    marginTop: 8,
  },

  chevron: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },

  completedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  clearText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
