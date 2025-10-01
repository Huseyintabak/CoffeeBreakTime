import { TimerError } from '@/types/timer';

// Error handling utilities
export const handleTimerError = (error: TimerError): string => {
  switch (error) {
    case TimerError.INVALID_DURATION:
      return 'Lütfen geçerli bir süre girin (1-1440 dakika)';
    case TimerError.NOTIFICATION_DENIED:
      return 'Bildirimler için izin vermeniz gerekiyor';
    case TimerError.BROWSER_NOT_SUPPORTED:
      return 'Tarayıcınız bu özelliği desteklemiyor';
    case TimerError.STORAGE_ERROR:
      return 'Veri kaydetme hatası oluştu';
    case TimerError.AUDIO_ERROR:
      return 'Ses çalma hatası oluştu';
    default:
      return 'Beklenmeyen bir hata oluştu';
  }
};

export const validateTimerInput = (input: string): { isValid: boolean; error?: TimerError; duration?: number } => {
  try {
    const duration = parseTimeInput(input);
    
    if (duration < 1) {
      return { isValid: false, error: TimerError.INVALID_DURATION };
    }
    
    if (duration > 86400) { // 24 hours
      return { isValid: false, error: TimerError.INVALID_DURATION };
    }
    
    return { isValid: true, duration };
  } catch {
    return { isValid: false, error: TimerError.INVALID_DURATION };
  }
};

// Helper function for parseTimeInput (extracted from timeUtils for error handling)
const parseTimeInput = (input: string): number => {
  const parts = input.split(':');
  
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    
    if (isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid time format');
    }
    
    return minutes * 60 + seconds;
  } else if (parts.length === 1) {
    const minutes = parseInt(parts[0], 10);
    
    if (isNaN(minutes)) {
      throw new Error('Invalid time format');
    }
    
    return minutes * 60;
  }
  
  throw new Error('Invalid time format');
};

// Browser compatibility check
export const checkBrowserSupport = () => {
  const support = {
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    localStorage: typeof Storage !== 'undefined',
    indexedDB: 'indexedDB' in window,
  };
  
  return support;
};

export const getFallbackStrategy = () => {
  const support = checkBrowserSupport();
  
  if (!support.notifications) {
    return {
      notifications: 'visual-alerts',
      audio: support.webAudio ? 'web-audio' : 'html-audio'
    };
  }
  
  return null;
};

