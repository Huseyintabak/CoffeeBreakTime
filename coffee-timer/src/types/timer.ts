// Timer related types
export interface TimerState {
  duration: number; // in seconds
  remaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
}

export interface TimerActions {
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
  tick: () => void;
}

export interface TimerStore extends TimerState, TimerActions {
  cycles: TimerCycle[];
  // Computed properties
  progress: number; // 0-100
  formattedTime: string; // "MM:SS"
  coffeeLevel: number; // 0-100 for animation
}

// Timer cycle for statistics
export interface TimerCycle {
  id: string;
  duration: number;
  startTime: Date;
  endTime: Date | null;
  completed: boolean;
  notes?: string;
}

// Timer preferences
export interface TimerPreferences {
  defaultDuration: number; // in seconds
  soundEnabled: boolean;
  notificationEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  autoStart: boolean;
}

// Error types
export enum TimerError {
  INVALID_DURATION = 'INVALID_DURATION',
  NOTIFICATION_DENIED = 'NOTIFICATION_DENIED',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  AUDIO_ERROR = 'AUDIO_ERROR'
}

// Notification types
export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

// Storage types
export interface StoredData {
  preferences: TimerPreferences;
  cycles: TimerCycle[];
  lastSession: {
    duration: number;
    timestamp: Date;
  } | null;
}
