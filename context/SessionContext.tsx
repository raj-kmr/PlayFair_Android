import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "@/lib/api/apiClient";


type ActiveSession  = {
    id: number,
    gamesId: number,
    startedAt: string
}

type SessionContextValue = {
    activeSession: ActiveSession | null,
    elapsedSeconds: number,
    startSession: (gameId: number) => Promise<void>,
    endSession: () => Promise<{durationSeconds: number} | null>,
    hydrate: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);
const STORAGE_KEY = "playfair.activeSession";

/* Session Provider manages
* - active Session state
* - accurate timer
* - perssistance across reloads
*/
export function SessionProvider({children}: {children: React.ReactNode}) {
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Timer is derived from startedAt, prevents drift and survive reloads
    const startTicker = (startedAtIso: string) => {
        if(intervalRef.current) clearInterval(intervalRef.current)
        
        const startedAtMs = new Date(startedAtIso).getTime()

        intervalRef.current = setInterval(() => {
            const sec = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000))
            setElapsedSeconds(sec)
        }, 1000)
    }

    const stopTicker = () => {
        if(intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null;
        setElapsedSeconds(0)
    };

    // Hydration strategy
    // 1. Try local storage first (fast UI)
    // 2. Then confirm with server /sessions/active (source of truth)
    const hydrate = async () => {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        
        if(raw) {
            const saved: ActiveSession = JSON.parse(raw);
            setActiveSession(saved);
            startTicker(saved.startedAt)
        }

        // server truth 
        try {  
            const res = await api.get("/sessions/active");
            const s = res.data.session as
                    | {id: number; games_id: number; started_at: string}
                    | null;

            if(!s) {
                setActiveSession(null);
                await AsyncStorage.removeItem(STORAGE_KEY)
                stopTicker()
                return;
            }

            const next: ActiveSession = {id: s.id, gamesId: s.games_id, startedAt: s.started_at}
            setActiveSession(next)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            startTicker(next.startedAt);
        } catch {
            // If server call fails, keep local session to avoid breaking UX
        }
    }

    useEffect(() => {
        void hydrate();
        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    // Starts a session on backend then saves locally
    const startSession = async(gameId: number) => {
        const res = await api.post(`/games/${gameId}/sessions/start`)
        const s = res.data.session as {id: number; games_id: number; started_at: string}

        const next: ActiveSession = {
            id: s.id,
            gamesId: s.games_id,
            startedAt: s.started_at
        }

        setActiveSession(next);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        startTicker(next.startedAt)
    };

    // Ends Active session on backend.
    // Backend end "users active session" so we do not need session id in URL

    const endSession = async () => {
        if(!activeSession) return null

        const res = await api.post(`/games/${activeSession.gamesId}/sessions/end`)
        const s = res.data.session as {duration_seconds: number}

        setActiveSession(null)
        await AsyncStorage.removeItem(STORAGE_KEY)
        stopTicker();

        return { durationSeconds: s.duration_seconds}
    };

    const value = useMemo(() => ({
        activeSession, elapsedSeconds, startSession, endSession, hydrate
    }), [activeSession, elapsedSeconds])

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
    const ctx = useContext(SessionContext)
    if (!ctx) throw new Error("useSession must be used within SessionProvider")
    return ctx;
}
