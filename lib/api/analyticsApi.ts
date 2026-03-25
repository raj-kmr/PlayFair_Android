import { api } from "./apiClient";
import { PlaytimeResponse, SessionStats, TaskAnalytics } from "../analytics";

export const getPlaytimeAnalytics = async (): Promise<PlaytimeResponse> => {
    const { data } = await api.get("/api/analytics/playtime")
    return data;
}

export const getSessionStats = async (): Promise<SessionStats> => {
    const { data } = await api.get("/api/analytics/sessions")
    return data;
}

export const getTaskAnalytics = async(): Promise<TaskAnalytics> => {
    const {data} = await api.get("/api/analytics/tasks")
    return data;
}