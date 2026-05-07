import { useEffect, useRef, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import {
  initializeNotifications,
  displayNotification,
} from '../utils/notificationService';

/**
 * Notification Hook - Logs notification clicks
 */

const useNotification = () => {
  // Handle foreground notifications
  const handleForegroundNotification = useCallback(
    async (message: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Foreground notification:', message.notification?.title);
      console.log('Foreground data:', JSON.stringify(message.data, null, 2));
      await displayNotification(message);
      DeviceEventEmitter.emit('REFRESH_NOTIFICATIONS_COUNT');
    },
    [],
  );

  // Initialize notifications
  const initNotifications = useCallback(async () => {
    try {
      console.log('Initializing notifications...');

      const result = await initializeNotifications(
        handleForegroundNotification,
      );

      // console.log('Notifications initialized');
      console.log('Notifications initialization ');
      return result;
    } catch (error) {
      console.error('Notification init error:', error);
      return null;
    }
  }, [handleForegroundNotification]);

  // Handle language changes - unsubscribe from old topics and subscribe to new ones

  // Initialize on mount
  useEffect(() => {
    let isCancelled = false;
    let localUnsubscribe: (() => void) | null = null;

    const runInit = async () => {
      const result = await initNotifications();

      if (isCancelled) {
        // If effect was cleaned up while initializing, unsubscribe immediately
        result?.unsubscribe?.();
        console.log(
          'Cleanup: Notification initialization cancelled during async execution',
        );
      } else if (result) {
        localUnsubscribe = result.unsubscribe;

        // Handle initial notification only once
        if (result.initialNotification) {
          console.log('Handling initial notification from quit state');
        }
      }
    };

    runInit();

    return () => {
      isCancelled = true;
      // unsubscribeRef.current?.();
      if (localUnsubscribe) {
        localUnsubscribe();
        console.log('Cleanup: Notification listeners unsubscribed');
      }
    };
  }, [initNotifications]);
};

export default useNotification;
