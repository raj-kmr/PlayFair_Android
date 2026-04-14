export type ReminderType = "session_limit" | "daily_limit" | "break_reminder" | "game_time";

export interface Reminder {
  id: number;
  users_id: number;
  games_id: number | null;
  reminder_type: ReminderType;
  reminder_value: number;
  scheduled_time: string | null;
  scheduled_days: string[] | null;
  is_active: boolean;
  created_at: string;
  game_name?: string;
}

export interface CreateReminderPayload {
  gamesId?: number | null;
  reminderType: ReminderType;
  reminderValue: number;
  scheduledTime?: string;
  scheduledDays?: string[];
}