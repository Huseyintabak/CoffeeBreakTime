import { useState, useEffect, useCallback } from 'react';
import { TimerError } from '@/types/timer';

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
}

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: false,
  });
  
  // Check browser support and current permission
  useEffect(() => {
    const isSupported = 'Notification' in window;
    const permission = isSupported ? Notification.permission : 'denied';
    
    setState({
      permission,
      isSupported,
    });
  }, []);
  
  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      throw new Error(TimerError.BROWSER_NOT_SUPPORTED);
    }
    
    if (state.permission === 'granted') {
      return true;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      
      if (permission === 'denied') {
        throw new Error(TimerError.NOTIFICATION_DENIED);
      }
      
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }, [state.isSupported, state.permission]);
  
  // Show notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!state.isSupported) {
      console.warn('Notifications not supported in this browser');
      return null;
    }
    
    if (state.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    
    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        requireInteraction: true,
        ...options,
      });
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
      
      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }, [state.isSupported, state.permission]);
  
  // Show timer completion notification
  const showTimerCompleteNotification = useCallback((duration: number) => {
    const minutes = Math.floor(duration / 60);
    const title = '☕ Kahve Molası Tamamlandı!';
    const body = `${minutes} dakikalık timer'ınız bitti. Yeni bir mola başlatabilirsiniz.`;
    
    return showNotification(title, {
      body,
      tag: 'timer-complete',
      requireInteraction: true,
    });
  }, [showNotification]);
  
  // Show timer start notification
  const showTimerStartNotification = useCallback((duration: number) => {
    const minutes = Math.floor(duration / 60);
    const title = '⏰ Timer Başlatıldı';
    const body = `${minutes} dakikalık kahve molanız başladı.`;
    
    return showNotification(title, {
      body,
      tag: 'timer-start',
      requireInteraction: false,
    });
  }, [showNotification]);
  
  // Show break reminder notification
  const showBreakReminderNotification = useCallback(() => {
    const title = '☕ Mola Zamanı!';
    const body = 'Uzun süredir çalışıyorsunuz. Bir kahve molası vermeyi düşünün.';
    
    return showNotification(title, {
      body,
      tag: 'break-reminder',
      requireInteraction: true,
    });
  }, [showNotification]);
  
  return {
    // State
    permission: state.permission,
    isSupported: state.isSupported,
    canNotify: state.isSupported && state.permission === 'granted',
    
    // Actions
    requestPermission,
    showNotification,
    showTimerCompleteNotification,
    showTimerStartNotification,
    showBreakReminderNotification,
  };
};

