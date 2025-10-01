import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimerStore, TimerCycle } from '@/types/timer';
import { formatTime, getProgress, getCoffeeLevel } from '@/utils/timeUtils';
import { TimerStorage } from '@/utils/storageUtils';

const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // State
      duration: 25 * 60, // 25 minutes default
      remaining: 25 * 60,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      startTime: null,
      endTime: null,
      cycles: [],
      intervalId: null as NodeJS.Timeout | null,
      
      // Computed properties - as regular functions to ensure subscription
      progress: () => {
        const { remaining, duration } = get();
        const progress = getProgress(remaining, duration);
        return isNaN(progress) ? 0 : progress; // Fallback to 0 if NaN
      },
      
      formattedTime: () => {
        const { remaining } = get();
        return formatTime(remaining);
      },
      
      coffeeLevel: () => {
        const { progress } = get();
        const level = getCoffeeLevel(progress);
        return isNaN(level) ? 100 : level; // Fallback to 100 if NaN
      },
      
      // Actions
      setDuration: (duration: number) => {
        set({
          duration,
          remaining: duration,
          isCompleted: false,
          startTime: null,
          endTime: null,
        });
      },
      
      updateRemaining: (remaining: number) => {
        set({ remaining });
      },
      
      startTimer: () => {
        const { remaining, isPaused } = get();
        
        if (remaining <= 0) return;
        
        set({
          isRunning: true,
          isPaused: false,
          startTime: isPaused ? get().startTime : new Date(),
        });
      },
      
      pauseTimer: () => {
        set({
          isRunning: false,
          isPaused: true,
        });
      },
      
      resumeTimer: () => {
        const { remaining } = get();
        
        if (remaining <= 0) return;
        
        set({
          isRunning: true,
          isPaused: false,
        });
      },
      
      resetTimer: () => {
        const { duration } = get();
        
        set({
          remaining: duration,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
          startTime: null,
          endTime: null,
        });
      },
      
      completeTimer: () => {
        const { startTime, duration } = get();
        const endTime = new Date();
        
        // Create new cycle (for future statistics)
        // const newCycle: TimerCycle = {
        //   id: crypto.randomUUID(),
        //   duration,
        //   startTime: startTime || endTime,
        //   endTime,
        //   completed: true,
        // };
        
        set({
          isRunning: false,
          isPaused: false,
          isCompleted: true,
          endTime,
          remaining: 0,
        });
      },
      
             tick: () => {
               const state = get();
               const { remaining, isRunning } = state;
               
               console.log('Tick called:', { remaining, isRunning }); // Debug log
               
               if (!isRunning || remaining <= 0) {
                 console.log('Tick early return:', { isRunning, remaining }); // Debug log
                 return;
               }
               
               const newRemaining = remaining - 1;
               console.log('New remaining:', newRemaining); // Debug log
               
               if (newRemaining <= 0) {
                 console.log('Timer completed, calling completeTimer'); // Debug log
                 get().completeTimer();
               } else {
                 console.log('Setting new remaining:', newRemaining); // Debug log
                 set({ remaining: newRemaining });
               }
             },
             
             // Start the timer interval
             startTimerInterval: () => {
               const interval = setInterval(() => {
                 get().tick();
               }, 1000);
               
               set({ intervalId: interval });
               console.log('Timer interval started:', interval); // Debug log
             },
             
             // Stop the timer interval
             stopTimerInterval: () => {
               const { intervalId } = get();
               if (intervalId) {
                 clearInterval(intervalId);
                 set({ intervalId: null });
                 console.log('Timer interval stopped:', intervalId); // Debug log
               }
             },
      
      addCycle: (cycle: TimerCycle) => {
        // Save to storage
        const currentData = TimerStorage.load() || TimerStorage.getDefaultData();
        const newCycles = [...(currentData.cycles || []), cycle];
        TimerStorage.save({ ...currentData, cycles: newCycles });
      },
    }),
    {
      name: 'coffee-timer-store',
      partialize: (state) => ({
        duration: state.duration,
        preferences: {
          defaultDuration: state.duration,
          soundEnabled: true,
          notificationEnabled: true,
          theme: 'system' as const,
          autoStart: false,
        },
      }),
    }
  )
);

export default useTimerStore;
