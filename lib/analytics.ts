
export interface PlaytimeResponse  {
    total_minutes: number,
    weekly: {day: string, minutes: number}[],
    monthly: {week: string, minutes: number}[]
}

export interface SessionStats {
    total_sessions: number,
    avg_session_minutes: number,
    max_session_minutes: number
}

export interface TaskAnalytics {
    completed: number,
    total: number,
    percentage: number
}