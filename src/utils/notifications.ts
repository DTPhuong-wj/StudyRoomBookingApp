import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Failed to get notification permissions:', error);
    return false;
  }
}

/**
 * Schedules a local check-in notification 15 minutes prior to the booked slot start time.
 */
export async function scheduleCheckInNotification(
  roomName: string,
  dateStr: string, // YYYY-MM-DD
  startTimeStr: string, // HH:mm (e.g. 07:30)
  groupName: string
): Promise<string | undefined> {
  if (Platform.OS === 'web') {
    console.log('[Web Mock Notification] Scheduled for 15 minutes before:', startTimeStr);
    return `mock-notif-${Date.now()}`;
  }

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted.');
      return undefined;
    }

    // Parse date and time
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = startTimeStr.split(':').map(Number);

    const slotStartDateTime = new Date(year, month - 1, day, hours, minutes);
    
    // Calculate trigger date: 15 minutes before slot start
    const triggerTime = new Date(slotStartDateTime.getTime() - 15 * 60 * 1000);
    const now = new Date();

    // If trigger time is in the past, schedule it 5 seconds from now for demo purposes
    const secondsUntilTrigger = triggerTime > now 
      ? Math.floor((triggerTime.getTime() - now.getTime()) / 1000)
      : 5;

    const notifId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 VKU Room Booking Check-In Reminder',
        body: `Your booking for ${roomName} (${groupName}) starts in 15 minutes! Open the app to scan your QR check-in pass.`,
        data: { dateStr, startTimeStr, roomName },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger > 0 ? secondsUntilTrigger : 5,
        repeats: false,
      },
    });

    console.log(`Notification scheduled with ID ${notifId} in ${secondsUntilTrigger}s`);
    return notifId;
  } catch (error) {
    console.warn('Error scheduling notification:', error);
    return undefined;
  }
}

export async function cancelNotification(notificationId?: string): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Error cancelling notification:', error);
  }
}
