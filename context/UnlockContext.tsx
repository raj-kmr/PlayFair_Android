import { api } from "@/lib/api/apiClient";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";

type UnlockData = {
    availableMinutes: number,
    earnedMinutes: number,
    usedMinutes: number
}

type UnlockRule = {
    minutes_per_task: number,
    daily_limit_minutes: number | null
}

type unlockDataContext = {
    unlockData: UnlockData | null,
    rule: UnlockRule | null,
    loading: boolean,
    refreshUnlock: () => Promise<void>
}

type Props = {
    children: React.ReactNode;
}

const UnlockContext = createContext<unlockDataContext | null>(null);

export function UnlockProvider ({children}: Props) {
    const { isAuthenticated } = useAuth();
    const [unlockData, setUnlockData] = useState<UnlockData | null>(null);
    const [rule, setRule] = useState<UnlockRule | null>(null)
    const [loading, setLoading] = useState(true);

    const fetchUnlockData = async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true)
            const [ruleRes, dataRes] = await Promise.all ([
                api.get("/unlock-rules"),
                api.get(`/unlock-rules/available-time`)
            ])
            setRule(ruleRes.data);
            setUnlockData(dataRes.data);
        } catch(err) {
            console.error("Unlock fetch error: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUnlockData();
    }, [])

    return (
        <UnlockContext.Provider value={{
            unlockData,
            rule,
            loading,
            refreshUnlock: fetchUnlockData
        }}>
            {children}
        </UnlockContext.Provider>
    )
}

export function useUnlock() {
    const context = useContext(UnlockContext);
    if(!context) throw new Error("useUnlock must be used inside Unlock Provider")
    return context;
}