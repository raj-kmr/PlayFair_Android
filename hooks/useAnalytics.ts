import { useEffect, useState } from "react"
import { getPlaytimeAnalytics, getSessionStats, getTaskAnalytics } from "@/lib/api/analyticsApi";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";


export const useAnalytics = (timeRange: '7d' | '30d' = '7d')  => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playtime, setPlaytime] = useState<any>(null)
    const [sessions, setSessions] = useState<any>(null)
    const [tasks, setTasks] = useState<any>(null)

    const fetchAnalytics = useCallback(async (useCache = true, forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);

            // Try to get cached data first (skip if forceRefresh)
            if (useCache && !forceRefresh) {
                const cachedData = await AsyncStorage.getItem(`@analytics_data_${timeRange}`);
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    // Check if cache is less than 5 minutes old
                    if (parsedData.timestamp && (Date.now() - parsedData.timestamp) < 5 * 60 * 1000) {
                        setPlaytime(parsedData.playtime);
                        setSessions(parsedData.sessions);
                        setTasks(parsedData.tasks);
                        setLoading(false);
                        return; // Return early if we have valid cached data
                    }
                    // If cache is expired, continue to fetch fresh data
                }
            }

            // Fetch fresh data from API
            // Run all API calls in parallel (faster)
            const [p, s, t] = await Promise.all([
                getPlaytimeAnalytics(timeRange),
                getSessionStats(timeRange),
                getTaskAnalytics(timeRange)
            ])

            setPlaytime(p);
            setSessions(s);
            setTasks(t);

            // Cache the data for 5 minutes
            const dataToCache = {
                playtime: p,
                sessions: s,
                tasks: t,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(`@analytics_data_${timeRange}`, JSON.stringify(dataToCache));
        } catch(err){
            const errorMsg = getApiErrorMessage(err);
            console.error("Analytics fetch error: ", errorMsg);
            setError(errorMsg);
        } finally{
            setLoading(false);
        }
    }, [timeRange])

    useEffect(() => {
        fetchAnalytics()
    }, [timeRange, fetchAnalytics])
    
    return {loading, error, playtime, sessions, tasks, refetch: (forceRefresh = false) => fetchAnalytics(true, forceRefresh)}
}
