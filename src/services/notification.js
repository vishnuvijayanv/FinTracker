import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BHF7J9lWryWPCc5ExtRqFnKbpn6JDEoKplt9R6bBQx7IkKnGGRZbop8l-dpjrhm5hWUZUG2BgMsHYd2BYQRmZaM',
      });
      console.log('FCM Token:', token);
    } else {
      console.warn('Notification permission not granted.');
    }
  } catch (err) {
    console.error('Error getting notification permission:', err);
  }
};
