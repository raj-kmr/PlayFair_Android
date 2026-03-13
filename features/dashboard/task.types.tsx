export type Task = {
    id: number,
    title: string,
    description: string | null,
    category: string | null,
    frequency: string,
    targetDays: string[] | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export type DailyTask = {
    id: number,
    title: string,
    description: string | null,
    category: string | null,
    frequency: string,
    targetDays: string[] | null,
    isCompleted: boolean,
    completedAt: string | null
}

export type DailyTaskSummary = {
    total: number,
    completed: number,
    percentage: number
}

export type DailyTaskStatusResponse = {
    date: string,
    summary: DailyTaskSummary,
    tasks: DailyTask[]
}

export type CreateTaskPayload = {
    title: string,
    description?: string,
    category?: string,
    frequency?: "daily" | "weekly" | "custom",
    targetDays?: string[] | null
}

export type UpdateDailyStatusPayload = {
    date: string,
    isCompleted: boolean
}