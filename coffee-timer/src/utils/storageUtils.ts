import { StoredData, TimerPreferences, TimerCycle } from '@/types/timer';

// Storage utility functions
export class TimerStorage {
  private static STORAGE_KEY = 'coffee-timer-data';
  
  static save(data: StoredData): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }
  
  static load(): StoredData | null {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      }
      return null;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  }
  
  static clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
  
  static getDefaultData(): StoredData {
    return {
      preferences: {
        defaultDuration: 25 * 60, // 25 minutes
        soundEnabled: true,
        notificationEnabled: true,
        theme: 'system',
        autoStart: false,
      },
      cycles: [],
      lastSession: null,
    };
  }
}

// Preferences management
export const savePreferences = (preferences: TimerPreferences): boolean => {
  const currentData = TimerStorage.load() || TimerStorage.getDefaultData();
  const newData = { ...currentData, preferences };
  return TimerStorage.save(newData);
};

export const loadPreferences = (): TimerPreferences => {
  const data = TimerStorage.load();
  return data?.preferences || TimerStorage.getDefaultData().preferences;
};

// Cycles management
export const saveCycle = (cycle: TimerCycle): boolean => {
  const currentData = TimerStorage.load() || TimerStorage.getDefaultData();
  const newCycles = [...currentData.cycles, cycle];
  const newData = { ...currentData, cycles: newCycles };
  return TimerStorage.save(newData);
};

export const loadCycles = (): TimerCycle[] => {
  const data = TimerStorage.load();
  return data?.cycles || [];
};

export const clearCycles = (): boolean => {
  const currentData = TimerStorage.load() || TimerStorage.getDefaultData();
  const newData = { ...currentData, cycles: [] };
  return TimerStorage.save(newData);
};

