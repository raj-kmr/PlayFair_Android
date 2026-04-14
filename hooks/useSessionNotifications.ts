import { useEffect, useRef, useCallback } from "react";
import * as Notifications from "expo-notifications";
import {
  requestNotificationPermission,
  scheduleSessionWarningNotification,
  cancelSessionWarningNotifications,
  scheduleGameTimeReminder,
  cancelGameTimeReminder,
} from "@/lib/notifications";

export function useSessionNotifications() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const scheduleSessionWarnings = useCallback(async (sessionId: string, totalSessionMinutes: number) => {
    await cancelSessionWarningNotifications(sessionId);

    if (totalSessionMinutes > 30) {
      await scheduleSessionWarningNotification(sessionId, totalSessionMinutes - 30, "30min");
    }

    if (totalSessionMinutes > 10) {
      await scheduleSessionWarningNotification(sessionId, totalSessionMinutes - 10, "10min");
    }

    await scheduleSessionWarningNotification(sessionId, totalSessionMinutes, "ended");
  }, []);

  const cancelSessionWarnings = useCallback(async (sessionId: string) => {
    await cancelSessionWarningNotifications(sessionId);
  }, []);

  const scheduleGameTimeAlert = useCallback(async (
    reminderId: number,
    scheduledTime: string,
    gameName?: string
  ) => {
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);

    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    await cancelGameTimeReminder(reminderId);
    await scheduleGameTimeReminder(reminderId, scheduledDate, gameName || "");
  }, []);

  const cancelGameTimeAlert = useCallback(async (reminderId: number) => {
    await cancelGameTimeReminder(reminderId);
  }, []);

  return {
    scheduleSessionWarnings,
    cancelSessionWarnings,
    scheduleGameTimeAlert,
    cancelGameTimeAlert,
  };
}
