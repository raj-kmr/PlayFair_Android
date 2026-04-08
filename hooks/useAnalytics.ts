import { useEffect, useState } from "react"
import { getPlaytimeAnalytics, getSessionStats, getTaskAnalytics } from "@/lib/api/analyticsApi";
import { getApiErrorMessage } from "@/lib/api/apiClient";


export const useAnalytics = ()  => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playtime, setPlaytime] = useState<any>(null)
    const [sessions, setSessions] = useState<any>(null)
    const [tasks, setTasks] = useState<any>(null)

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Run all API calls in parallel (faster)
            const [p, s, t] = await Promise.all([
                getPlaytimeAnalytics(),
                getSessionStats(),
                getTaskAnalytics()
            ])

            setPlaytime(p);
            setSessions(s);
            setTasks(t);
        } catch(err){
            const errorMsg = getApiErrorMessage(err);
            console.error("Analytics fetch error: ", errorMsg);
            setError(errorMsg);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, []);
    
    return {loading, error, playtime, sessions, tasks, refetch: fetchAnalytics}
}