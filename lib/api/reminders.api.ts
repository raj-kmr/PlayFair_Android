import { api } from "./apiClient";
import { CreateReminderPayload } from "../reminders";

export const getReminders = async () => {
  const res = await api.get("/api/reminders");
  return res.data;
};

export const createReminder = async (data: CreateReminderPayload) => {
  const res = await api.post("/api/reminders", data);
  return res.data;
};

export const updateReminder = async (id: number, data: any) => {
  const res = await api.patch(`/api/reminders/${id}`, data);
  return res.data;
};

export const deleteReminder = async (id: number) => {
  const res = await api.delete(`/api/reminders/${id}`);
  return res.data;
};