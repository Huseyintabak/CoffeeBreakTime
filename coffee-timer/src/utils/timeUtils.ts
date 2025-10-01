// Time utility functions
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const parseTimeInput = (input: string): number => {
  // Parse "MM:SS" or "MM" format
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

export const validateDuration = (duration: number): boolean => {
  // Valid duration: 1 second to 24 hours
  return duration >= 1 && duration <= 86400;
};

export const getDefaultDurations = (): number[] => {
  // Common timer durations in seconds
  return [
    5 * 60,    // 5 minutes
    10 * 60,   // 10 minutes
    15 * 60,   // 15 minutes
    25 * 60,   // 25 minutes (Pomodoro)
    30 * 60,   // 30 minutes
    45 * 60,   // 45 minutes
    60 * 60,   // 1 hour
  ];
};

export const getProgress = (remaining: number, total: number): number => {
  if (total === 0) return 0;
  return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
};

export const getCoffeeLevel = (progress: number): number => {
  // Coffee level decreases as timer progresses
  return Math.max(0, 100 - progress);
};

export const getTimeUntilNextMinute = (): number => {
  const now = new Date();
  const nextMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
  return nextMinute.getTime() - now.getTime();
};

