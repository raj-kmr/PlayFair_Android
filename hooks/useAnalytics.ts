import { useEffect, useState } from "react"
import { getPlaytimeAnalytics, getSessionStats, getTaskAnalytics } from "@/lib/api/analyticsApi";
import { getApiErrorMessage } from "@/lib/api/apiClient";


export const useAnalytics = ()  => {
    const [loading, setLoading] = useState(true);
    const [playtime, setPlaytime] = useState<any>(null)
    const [sessions, setSessions] = useState<any>(null)
    const [tasks, setTasks] = useState<any>(null)

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Run all API calls in Parallel (faster)
            const [p, s, t] = await Promise.all([
                getPlaytimeAnalytics(),
                getSessionStats(),
                getTaskAnalytics()
            ])

            setPlaytime(p);
            setSessions(s);
            setTasks(t);
        } catch(err){
            console.error("Analytics fetch error: ", getApiErrorMessage(err))
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, []);
    
    return {loading, playtime, sessions, tasks, refetch: fetchAnalytics}
}