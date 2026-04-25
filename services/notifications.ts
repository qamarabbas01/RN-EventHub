import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Failed to get push permissions");
    return;
  }

  try {
    const options: any = {};
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (projectId) {
      options.projectId = projectId;
    }
    token = (await Notifications.getExpoPushTokenAsync(options)).data;
    console.log("Push token:", token);
  } catch (error) {
    console.log("Could not get push token (Expo Go or config issue):", error);
  }

  return token;
}

export async function scheduleEventReminder(
  eventId: string,
  eventTitle: string,
  eventDate: Date,
  eventTime: Date,
): Promise<string[]> {
  const notificationIds: string[] = [];

  // Combine date and time
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(
    eventTime.getHours(),
    eventTime.getMinutes(),
    eventTime.getSeconds(),
  );

  const now = new Date();

  // Schedule for 1 day before (24 hours)
  const oneDayBefore = new Date(eventDateTime);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  const ms1Day = oneDayBefore.getTime() - now.getTime();
  if (ms1Day > 0) {
    const id1 = await Notifications.scheduleNotificationAsync(
      {
        content: {
          title: "Event Reminder",
          body: `"${eventTitle}" is happening tomorrow!`,
          data: { eventId, type: "reminder" },
        },
      },
      { milliseconds: ms1Day } as any,
    );
    notificationIds.push(id1);
  }

  // Schedule for 1 hour before
  const oneHourBefore = new Date(eventDateTime);
  oneHourBefore.setHours(oneHourBefore.getHours() - 1);
  const ms1Hour = oneHourBefore.getTime() - now.getTime();
  if (ms1Hour > 0) {
    const id2 = await Notifications.scheduleNotificationAsync(
      {
        content: {
          title: "Event Starting Soon",
          body: `"${eventTitle}" starts in 1 hour!`,
          data: { eventId, type: "reminder" },
        },
      },
      { milliseconds: ms1Hour } as any,
    );
    notificationIds.push(id2);
  }

  return notificationIds;
}

export async function sendBookingConfirmation(
  eventTitle: string,
  bookingId: string,
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync(
    {
      content: {
        title: "Booking Confirmed",
        body: `Your booking for "${eventTitle}" is confirmed.`,
        data: { bookingId, type: "confirmation" },
      },
    },
    { seconds: 1 } as any,
  );
  return id;
}

export async function sendNewEventAlert(
  eventTitle: string,
  eventId: string,
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync(
    {
      content: {
        title: "New Event",
        body: `Check out the new event: "${eventTitle}"`,
        data: { eventId, type: "new_event" },
      },
    },
    { seconds: 1 } as any,
  );
  return id;
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
