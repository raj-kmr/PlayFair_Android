import { api } from "./apiClient";
import { PlaytimeResponse, SessionStats, TaskAnalytics } from "../analytics";

export const getPlaytimeAnalytics = async (timeRange: '7d' | '30d' | '90d' = '7d'): Promise<PlaytimeResponse> => {
    const { data } = await api.get(`/api/analytics/playtime?range=${timeRange}`)
    return data;
}

export const getSessionStats = async (timeRange: '7d' | '30d' | '90d' = '7d'): Promise<SessionStats> => {
    const { data } = await api.get(`/api/analytics/sessions?range=${timeRange}`)
    return data;
}

export const getTaskAnalytics = async(timeRange: '7d' | '30d' | '90d' = '7d'): Promise<TaskAnalytics> => {
    const {data} = await api.get(`/api/analytics/tasks?range=${timeRange}`)
    return data;
}