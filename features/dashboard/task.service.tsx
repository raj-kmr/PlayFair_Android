import { api } from "@/lib/api/apiClient";
//Typscript types that define the structure of data
import {
  CreateTaskPayload,
  Task,
  DailyTaskStatusResponse,
  UpdateDailyStatusPayload,
} from "./task.types";

// Send request to backend to create a new task
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post("/tasks", payload);

  return data.task;
}

// Fetch tasks from backend
export async function getTasks(active?: boolean): Promise<Task[]> {
  const query = typeof active === "boolean" ? `?active=${active}` : "";

  const { data } = await api.get(`/tasks${query}`);

  return data.tasks || [];
}

// Fetch completeion of tasks for a specific day
export async function getDailyTaskStatus(date: string) : Promise<DailyTaskStatusResponse> {
    const { data } = await api.get(`/tasks/daily-status?date=${date}`)

    return data;
}

// Mark task as completed / skipped / etc for a specific day
export async function updateDailyTaskStatus(taskId: number, payload: UpdateDailyStatusPayload) {
    const {data} = await api.patch(`/tasks/${taskId}/daily-status`, payload)

    return data.status;
}