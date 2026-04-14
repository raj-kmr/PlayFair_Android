import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3b82f6",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleSessionWarningNotification(
  sessionId: string,
  minutesUntilWarning: number,
  warningType: "30min" | "10min" | "ended",
) {
  const titles = {
    "30min": "⏰ 30 Minutes Remaining",
    "10min": "⚠️ 10 Minutes Remaining",
    ended: "🛑 Session Time Ended",
  };

  const bodies = {
    "30min": "Your gaming session will end in 30 minutes. Wrap up soon!",
    "10min": "Only 10 minutes left in your session. Time to finish up!",
    ended: "Your session time has been used up. Take a break!",
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titles[warningType],
      body: bodies[warningType],
      data: { sessionId, warningType, type: "session_warning" },
      sound: true,
    },
    trigger: {
      seconds: minutesUntilWarning * 60,
      channelId: "default",
    },
  });
}

export async function cancelSessionWarningNotifications(sessionId: string) {
  const allNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const sessionNotifications = allNotifications.filter(
    (n) =>
      n.content.data?.sessionId === sessionId &&
      n.content.data?.type === "session_warning",
  );

  for (const notification of sessionNotifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier,
    );
  }
}

export async function scheduleGameTimeReminder(
  reminderId: number,
  scheduledTime: Date,
  gameName: string,
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎮 Time to Play!",
      body: `It's time for your scheduled gaming session${gameName ? ` - ${gameName}` : ""}!`,
      data: { reminderId, gameName, type: "game_time_reminder" },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledTime,
      channelId: "default",
      // repeats: true,
    },
  });
}

export async function cancelGameTimeReminder(reminderId: number) {
  const allNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const gameTimeNotifications = allNotifications.filter(
    (n) =>
      n.content.data?.reminderId === reminderId &&
      n.content.data?.type === "game_time_reminder",
  );

  for (const notification of gameTimeNotifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier,
    );
  }
}

export async function scheduleBreakReminder(minutes: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "☕ Break Time!",
      body: `You've been gaming for ${minutes} minutes. Take a healthy break!`,
      data: { type: "break_reminder" },
      sound: true,
    },
    trigger: {
      seconds: minutes * 60,
      channelId: "default",
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function getActiveScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
