import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { DailyTask, DailyTaskStatusResponse } from "../task.types";
import { getTodayDateString } from "@/lib/date";
import { getDailyTaskStatus, updateDailyTaskStatus } from "../task.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import ProgressHeader from "./ProcessHeader";
import TaskItem from "./TaskItem";


export default function TaskSection() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [data, setData] = useState<DailyTaskStatusResponse | null>(null);
  const today = getTodayDateString();

  // function to load tasks from backend
  const loadData = useCallback(async () => {
    const response = await getDailyTaskStatus(today);
    setData(response);
  }, [today])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadData();

      } catch (err) {
        Alert.alert("Error", getApiErrorMessage(err))
      } finally {
        setLoading(false);
      }
    })();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  )

  // pull to refresh function 
  const onRefresh = useCallback(async() => {
    try {
      setRefreshing(true);
      await loadData();
    }catch(err) {
      Alert.alert("Error", getApiErrorMessage(err))
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // User toggle tasks completion
  const onToggle = useCallback( async (task: DailyTask) => {
    if(!data) return

    const previous = data;

    const nextTasks = data.tasks.map((item) => 
      item.id === task.id ?
        {...item, isCompleted: !item.isCompleted} : item
    )

    const completed = nextTasks.filter((item) => item.isCompleted).length;

    const total = nextTasks.length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    setData({
      ...data,
      tasks: nextTasks,
      summary: {
        total,
        completed,
        percentage
      }
    })

    try {
      setSubmittingId(task.id);
      await updateDailyTaskStatus(task.id, {
        date: today,
        isCompleted: !task.isCompleted
      })
    } catch(err) {
      setData(previous)
      Alert.alert("Error", getApiErrorMessage(err))
    } finally {
      setSubmittingId(null);
    }

  }, [data, today])

  if(loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size={"large"}/>
      </View>
    )
  }

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <Pressable onPress={() => router.push("/create-task")}>
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <ProgressHeader completed={data?.summary.completed || 0} total={data?.summary.total || 0} percentage={data?.summary.percentage || 0}/>

      <FlatList 
        data={data?.tasks || []}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }

        renderItem={({item}) => (
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
          />
    </View>
  )
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
})